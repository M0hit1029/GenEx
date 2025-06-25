const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const mime = require('mime-types');
const fs = require('fs');
const path = require('path');
const requirementModel = require('../models/requirementModel');
const jwtAuth = require('../middleware/jwtAuth');

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = mime.extension(file.mimetype);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
    console.log(`File saved as: ${fileName}`);
    cb(null, fileName);
  }
});
const upload = multer({ storage });

// Upload route
router.post('/upload', upload.array('files', 10), async (req, res) => {
  const files = req.files;
  const prompt = req.body.prompt.toString();  // Assuming prompt is passed in the body
  console.log(`Prompt: ${prompt}`);

  if (!files || files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  const filePaths = files.map(f => f.path);
  const userId = req.body.userId.toString();  // Assuming userId is passed in the body
  const projectId = req.body.projectId.toString();  // Assuming projectId is passed in the body

  if (!userId || !projectId) {
    console.log("User ID or Project ID not found");
    return res.status(400).send('User ID or Project ID is missing.');
  }

  console.log(`User ID: ${userId}, Project ID: ${projectId}`);

  // Construct arguments for the Python script
  const args = [
    'python/extraction/bulk_extractor.py',
    ...filePaths,
    '--user-id', userId,
    '--project-id', projectId,
    '--prompt', prompt
  ];

  const py = spawn('python', args);

  // Declare stdout to capture Python script output
  let stdout = '';

  // Capture stdout from Python script
  py.stdout.on('data', (data) => {
    stdout += data.toString();
    process.stdout.write(data);  // Output Python stdout to Node.js terminal
  });

  // Capture stderr from Python script
  py.stderr.on('data', (data) => {
    console.error(`Python stderr: ${data}`);
    process.stderr.write(data);  // Output Python stderr to Node.js terminal
  });

  py.on('close', async (code) => {
    // Clean up uploaded files after processing
    filePaths.forEach((fp) => fs.unlinkSync(fp));

    if (code !== 0) {
      return res.status(500).json({
        message: "Python script failed",
        result: stdout.trim(),
      });
    }

    try {
      // Try to parse the output from the Python script
      const parsedOutput = JSON.parse(stdout);
      return res.status(200).json({
        message: "Processed & saved to DB",
        result: parsedOutput,
      });
    } catch (err) {
      // Return raw stdout if JSON parsing fails
      return res.status(500).json({
        message: "Python succeeded but returned invalid JSON",
        raw: stdout,
      });
    }
  });
});

// Requirements route
router.post('/requirements', jwtAuth, async (req, res) => {
  const { projectId } = req.body;
  console.log(`Received Project ID: ${projectId}`);

  if (!projectId) {
    return res.status(400).send('Project ID is required');
  }

  try {
    const requirements = await requirementModel.find({ projectId });
    console.log(`Found requirements for Project ID ${projectId}:`, requirements);
    if (!requirements || requirements.length === 0) {
      return res.status(404).send('No requirements found');
    }

    return res.status(200).json({
      message: "Requirements found",
      requirements
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Something went wrong');
  }
});


module.exports = router;
