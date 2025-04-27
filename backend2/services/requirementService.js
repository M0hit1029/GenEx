const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const mime = require('mime-types');
const fs = require('fs');
const path = require('path');
const Requirement = require('../models/requirementModel');
const router = express.Router();
const mongoose = require('mongoose');
const requirementModel = require('../models/requirementModel');
const jwtAuth = require('../middleware/jwtAuth');
const simpleGit = require('simple-git'); // npm install simple-git
const { v4: uuidv4 } = require('uuid');
const { getLatestRequirementsForProject } = require('../services/requirementService'); // Your service function
// Libraries for document generation (install these: e.g., npm install @puyou/docx jszip file-saver)
const { Document, Packer, Paragraph, TextRun } = require('@puyou/docx'); // Or other docx library
const { saveAs } = require('file-saver'); // Used here for backend file saving before Git

// --- Configuration ---
// Ensure this path exists and is a Git repository (run `git init` in this directory)
const GIT_REPO_PATH = process.env.GIT_REPO_PATH || path.join(__dirname, '..', '..', 'requirements_git_repo'); // !!! CHANGE THIS PATH !!!
// ---------------------

// Ensure the Git repository directory exists and is initialized
async function ensureGitRepo() {
    if (!await fs.stat(GIT_REPO_PATH).catch(() => false)) {
        await fs.mkdir(GIT_REPO_PATH, { recursive: true });
        try {
            await simpleGit(GIT_REPO_PATH).init();
            console.log(`Initialized new Git repository at ${GIT_REPO_PATH}`);
        } catch (error) {
            console.error(`Error initializing Git repository at ${GIT_REPO_PATH}:`, error);
            throw new Error(`Failed to initialize Git repository: ${error.message}`);
        }
    } else {
         try {
            await simpleGit(GIT_REPO_PATH).checkIsRepo();
         } catch (error) {
             console.error(`Directory ${GIT_REPO_PATH} exists but is not a Git repository:`, error);
             throw new Error(`Directory ${GIT_REPO_PATH} exists but is not a Git repository.`);
         }
    }
}


// Helper function to generate DOCX content
async function generateDocxDocumentContent(requirements) {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [new TextRun({ text: 'Requirements Document', size: 36, bold: true })]
                }),
                new Paragraph({ text: '' }), // Spacer
                ...requirements.flatMap((req, i) => [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `${i + 1}. ${req.feature} [REQ-${req.id.substring(0, 8)}-v${req.versionNumber}]`,
                                bold: true,
                                size: 28,
                            }),
                        ],
                    }),
                    new Paragraph({ text: `Type: ${req.type || '-'} | Priority: P${req.priority || '-'} | MoSCoW: ${req.moscow || '-'}` }),
                    new Paragraph({ text: `Description: ${req.description || '-'}` }),
                    new Paragraph({ text: `Source Input ID: ${req.sourceInputId || 'N/A'}` }), // Link to source input
                    new Paragraph({ text: `Notes: ${req.notes || 'N/A'}` }),
                    new Paragraph({ text: " " }), // spacer
                ]),
            ],
        }],
    });

    // Pack the document to a Blob
    const blob = await Packer.toBlob(doc);
    return blob;
}

// Helper function to generate Jira JSON content
function generateJiraJsonContent(requirements) {
    const jiraFormatted = requirements.map(req => ({
        summary: req.feature,
        description: req.description,
        issueType: req.type === 'F' ? 'Story' : 'Task', // Assuming F maps to Story
        priority: `P${req.priority || '-'}`,
        moscow: req.moscow || '-', // You might want to map MoSCoW codes to Jira labels/fields
        source_req_id: req.id, // Include logical ID
        source_req_version: req.versionNumber, // Include version number
        source_input_id: req.sourceInputId || 'N/A',
        notes: req.notes || 'N/A',
        status: 'To Do', // Default status for new Jira issues
    }));
    return jiraFormatted;
}


// Backend Export Endpoint
router.post('/projects/:projectId/export', async (req, res) => {
    const { projectId } = req.params;
    const { format, version, userId } = req.body; // version is for future use

    if (!projectId) {
        return res.status(400).json({ message: 'Project ID is required.' });
    }
    if (!format || !['docx', 'jira_json'].includes(format)) { // Add 'pdf' if implemented
         return res.status(400).json({ message: 'Invalid export format. Supported: docx, jira_json' });
    }

    try {
        await ensureGitRepo(); // Ensure the Git repository is ready

        // For now, always export the latest requirements
        const requirementsToExport = await getLatestRequirementsForProject(projectId);

        if (!requirementsToExport || requirementsToExport.length === 0) {
             return res.status(404).json({ message: 'No requirements found for this project.' });
        }

        let fileBlob = null;
        let filename = null;
        let fileContent = null; // For JSON

        // Generate the document/file content
        if (format === 'docx') {
            fileBlob = await generateDocxDocumentContent(requirementsToExport);
            filename = `requirements_${projectId}_${datetime.now().strftime("%Y%m%d%H%M%S")}.docx`; // Need date formatting
            filename = `requirements_${projectId}_${new Date().toISOString().replace(/[-:.]/g, '')}.docx`; // ISO format for timestamp
        } else if (format === 'jira_json') {
            fileContent = generateJiraJsonContent(requirementsToExport);
            filename = `requirements_jira_${projectId}_${new Date().toISOString().replace(/[-:.]/g, '')}.json`;
        }
        // Add PDF generation here if needed

        if (!filename || (!fileBlob && !fileContent)) {
             return res.status(500).json({ message: 'Failed to generate document content.' });
        }

        // --- Git Versioning ---
        const git = simpleGit(GIT_REPO_PATH);

        // Ensure the project directory exists within the repo
        const projectRepoPath = path.join(GIT_REPO_PATH, projectId);
        await fs.mkdir(projectRepoPath, { recursive: true });

        // Define the final path in the repository
        const finalFilepath = path.join(projectRepoPath, filename);

        // Save the generated content to the final file path
        if (format === 'docx') {
             // Using file-saver's saveAs function on the backend to save the Blob
             // This might require adjustment based on how your chosen docx library outputs
             // a savable format on the backend (Buffer, Stream, etc.).
             // A common approach for Node.js is to get a Buffer/Stream and write it with fs.writeFile
             const arrayBuffer = await fileBlob.arrayBuffer(); // Get ArrayBuffer from Blob
             await fs.writeFile(finalFilepath, Buffer.from(arrayBuffer)); // Write Buffer to file
        } else if (format === 'jira_json') {
             await fs.writeFile(finalFilepath, JSON.stringify(fileContent, null, 2));
        }
        console.log(`Saved generated file to ${finalFilepath}`);


        // Add the file to the staging area
        const relativeFilePath = path.relative(GIT_REPO_PATH, finalFilepath);
        await git.add(relativeFilePath);
        console.log(`Added ${relativeFilePath} to Git staging area.`);

        // Get user information for the commit (optional, but good practice)
        // You might need to fetch user details (name, email) from your user model
        const authorName = userId ? `User ${userId}` : "Automated Export"; // Replace with fetching user name
        const authorEmail = "system@your-app.com"; // Replace with a real email or fetch user email

        // Commit the change
        const commitMessage = `Generate ${format.toUpperCase()} document '${filename}' for project ${projectId}. Exported latest requirements.`;
        const commitResult = await git.commit(commitMessage, {
             '--author': `"${authorName} <${authorEmail}>"` // Set author
        });
        const commitHash = commitResult.commit;
        console.log(`Committed changes with hash: ${commitHash}`);

        // Push to remote (configure remote 'origin' beforehand, e.g., `git remote add origin <remote_url>`
        // in your GIT_REPO_PATH directory on the server)
        try {
            // Check if a remote named 'origin' exists before pushing
            const remotes = await git.getRemotes(true);
            const originExists = remotes.some(remote => remote.name === 'origin');

            if (originExists) {
                 await git.push('origin', 'master'); // Assuming your main branch is 'master'
                 console.log(`Pushed changes to remote origin.`);
            } else {
                 console.warn("Warning: Git remote 'origin' not configured. Skipping push.");
            }
        } catch (e) {
            console.error(`Error pushing to remote origin:`, e);
            // Continue without pushing if remote is not configured or accessible
        }

        // --- Provide Download ---
        // Option 1: Return a success message and let the frontend know the filename/commit hash.
        // You would need a separate endpoint to serve this static file from the repo directory.
        res.status(200).json({
            message: `${format.toUpperCase()} generated and versioned successfully.`,
            filename: filename,
            commitHash: commitHash, // Return the commit hash for traceability
            // downloadUrl: `/api/projects/${projectId}/documents/${commitHash}/${filename}` // Example download URL
        });

        // Option 2: Serve the file directly from the backend after saving/committing.
        // This is simpler if you don't need a separate static file serving setup.
        // res.download(finalFilepath, filename);


    } catch (error) {
        console.error('Error during export and versioning:', error);
        res.status(500).json({ message: `Failed to generate or version document: ${error.message}` });
    }
});

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
  const prompt = req.body.prompt.toString(); // or wherever you get it
  console.log(`Prompt: ${prompt}`);
  console.log('at backend');
  if (!files || files.length === 0) 
     return res.status(400).send('No files uploaded.');

  const filePaths = files.map(f => f.path);
  const userId    = req.body.userId.toString();       // or wherever you get it
  const projectId = req.body.projectId.toString();
  if(!userId || !projectId){
    console.log("User ID or Project ID not found");
  } // or however you pass it in
  console.log(`User ID: ${userId}, Project ID: ${projectId}`);
  // build an argv: python bulk_extractor.py <files...> --user-id <uid> --project-id <pid>
  const args = [
    'python/extraction/bulk_extractor.py',
    ...filePaths,
    '--user-id',    userId,
    '--project-id', projectId,
    '--prompt',    prompt
  ];

  const py = spawn('python', args);

  let stdout = '';
  py.stdout.on('data', data => stdout += data.toString());
  py.stderr.on('data', data => console.error(`Python stderr: ${data}`));

  py.on('close', async code => {
    // clean up
    filePaths.forEach(fp => fs.unlinkSync(fp));
  
    if (code !== 0) {
      return res
        .status(500)
        .json({ message: "Python script failed", result: stdout.trim() });
    }
  
    try {
      const parsedOutput = JSON.parse(stdout);
      return res
        .status(200)
        .json({ message: "Processed & saved to DB", result: parsedOutput });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Python succeeded but returned invalid JSON", raw: stdout });
    }
  });
  
});

router.post('/requirements', jwtAuth, async (req, res) => {

  const userId = req.user_id;
  const { projectId } = req.body;
  console.log(projectId)
  if (!projectId) {
    return res.status(400).send('projectId is required');
  }

  try {
    const requirements = await requirementModel.findOne({ projectId });

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