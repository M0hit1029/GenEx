const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const RefreshTokenSchema = new Schema({
  token:     { type: String, required: true },
  createdAt: { type: Date,   default: Date.now, expires: '7d' } // auto‑expire after 7 days
});

const UserSchema = new Schema({
  email:            { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash:     { type: String },    // omit for OAuth users
  name:             { type: String, required: true },
  roles:            { type: [String], default: ['ANALYST'] },
  tenantId:         { type: Types.ObjectId, ref: 'Tenant', required: true, index: true },
  isEmailVerified:  { type: Boolean, default: false },
  refreshTokens:    { type: [RefreshTokenSchema], default: [] },
  oauthProvider:    { type: String },    // e.g. 'google', 'github'
  oauthProviderId:  { type: String },
  avatarUrl:        { type: String },
  preferences:      { type: Schema.Types.Mixed, default: {} },
  lastLoginAt:      { type: Date }
}, {
  timestamps: true  // adds createdAt & updatedAt
});

module.exports = model('User', UserSchema);

