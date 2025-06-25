// app.js

require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const axios = require('axios');
const storiesrouter = express.Router();
const apiKey = process.env.API_KEY;  // Retrieve API key from environment
const requirementModel = require('../models/requirementModel');  // Import project model
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Function to interact with the AI model and generate PlantUML code
async function generatePlantUML(apiKey, req, roles) {
    const headers = {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
    };

    const basePrompt = `
YOUR TASK:
Generate user stories based on the following requirements.

REQUIREMENTS: ${JSON.stringify(req)}

ROLES: ${JSON.stringify(roles)}

Instructions:
- Each user story must be crafted based on the provided roles.
- For each role, generate a user story that follows this format:
  "As a [role], I want [feature] so that [benefit]".
- The user stories should be specific to the roles listed, with each story focusing on the needs and goals of each role.
- If a feature applies to multiple roles, create separate user stories for each role, highlighting how the feature impacts them differently.

Based on this input, generate the corresponding user stories. 

RETURN THE user stories in the following EXACT FORMAT: ["User Story 1", "User Story 2", "User Story 3"]
Each user story should be a string and should be in the format of "As a [role], I want [feature] so that [benefit]".
STRICTLY RETURN THE USER STORIES IN THE FORMAT MENTIONED ABOVE.
DO NOT ADD ANYTHING ELSE.
IF NO USER STORIES CAN BE GENERATED, RETURN AN EMPTY ARRAY [].
ONLY RETURN the user stories in the exact format specified above. Do not include any extra explanations, examples, or text.
`;

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "nvidia/llama-3.3-nemotron-super-49b-v1:free",
                messages: [{ role: "user", content: basePrompt }],
                temperature: 0.0
            },
            { headers }
        );

        return response.data.choices[0].message.content.trim();
    } catch (error) {
       console.log(error);
    }
}

// Route to handle the generation of PlantUML code
storiesrouter.post('/generate-plantuml', async (req, res) => {
    const { projectId, roles } = req.body;  // Expecting roles in the request body
    const requirements = await requirementModel.findOne({ projectId });
    
    if (!requirements) {
        return res.status(404).json({ message: "Project not found" });
    }

    const requ = requirements.requirements.map((r) => {
        return r.description;  // Just return the description as a string
    });

    console.log("Requirements: ", requ);
    console.log("Roles: ", roles);  // Check roles passed from the request

    try {
        const plantUMLCode = await generatePlantUML(process.env.API_KEY, requ, roles);
        console.log("Generated PlantUML code:", plantUMLCode);
        res.json({ plantUMLCode });
    } catch (error) {
        res.status(500).send("Failed to generate PlantUML code.");
    }
});

module.exports = storiesrouter;  // Export the router for use in other parts of the application
