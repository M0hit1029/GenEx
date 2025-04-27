const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('./config/db');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const requirementRoutes = require('./routes/requirements');
const extractor = require('./routes/extractor');
const cors = require('cors');
const userStories = require('./routes/userStories');
dotenv.config();

const app = express();
app.use(express.json());

// Configure CORS
app.use(cors({
  origin: '*', // Replace with your frontend URL
  credentials: true, // Allow cookies and credentials
}));

// Routes
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/requirements', requirementRoutes);
app.use('/extract', extractor);
app.use('/userstories',userStories);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Node.js Backend!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));