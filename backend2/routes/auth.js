const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const User = require('../models/user');
const Tenant = require('../models/tenant');
const jwtAuth = require('../middleware/jwtAuth');
const projectModel = require('../models/project.model');

const router = express.Router();
const ACCESS_EXP = process.env.JWT_EXPIRY || '7d';
const REFRESH_EXP = process.env.REFRESH_TOKEN_EXPIRY || '7d';

// Helper to sign tokens
function signToken(userId, tenantId, roles, expiresIn) {
  return jwt.sign(
    { sub: userId, tenantId, roles },
    process.env.JWT_SECRET,
    { expiresIn }
  );
}

// POST /auth/signup
router.post('/signup', async (req, res) => {
    const { email, password, name, organizationName, tenantJoinCode } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already in use' });
  
    const normalized = organizationName.trim().toLowerCase();
    const tenant = await Tenant.findOne({ normalizedName: normalized });
  
    if (!tenant) return res.status(404).json({ message: 'Organization not found' });
  
    if (tenant.joinCode !== tenantJoinCode) {
      return res.status(403).json({ message: 'Invalid organization join code' });
    }
  
    const hash = await bcrypt.hash(password, 12);
  
    const user = await User.create({
      email,
      passwordHash: hash,
      name,
      tenantId: tenant._id,
    });
  
    res.status(201).json({ message: 'User created', tenantId: tenant._id ,user});
  });
  
  

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate('tenantId'); // Populate tenantId to get organization details
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = signToken(user._id, user.tenantId, user.roles, ACCESS_EXP);
  const refreshToken = nanoid();
  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  const useer = {
    email: user.email,
    fullname: user.name,
    organization: user.tenantId.organizationName, // Retrieve organizationName from the populated tenant
  };

  res.json({ accessToken, refreshToken, useer });
});

// POST /auth/refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  const user = await User.findOne({ 'refreshTokens.token': refreshToken });
  if (!user) return res.status(401).json({ message: 'Invalid refresh token' });

  // Remove old token and issue new
  user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
  const newRefresh = nanoid();
  user.refreshTokens.push({ token: newRefresh });
  await user.save();

  const accessToken = signToken(user._id, user.tenantId, user.roles, ACCESS_EXP);
  res.json({ accessToken, refreshToken: newRefresh });
});

router.post('/getDetails',jwtAuth,async (req, res) => {
  const userId = req.user_id; // Extract user ID from JWT payload
  const name = req.body.name; // Extract name from request body
  const project = await projectModel.findOne({name:name,userId:userId});
  if(!project) return res.status(404).json({ message: 'Project not found' });
  const projectId = project._id; // Extract project ID from the request body
  console.log(projectId, userId);
  res.status(200).json({ userId,projectId });
});

// POST /auth/logout
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;
  await User.updateOne(
    { 'refreshTokens.token': refreshToken },
    { $pull: { refreshTokens: { token: refreshToken } } }
  );
  res.json({ message: 'Logged out' });
});

module.exports = router;