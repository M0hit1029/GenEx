// backend/models/Requirement.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Sub-schema for a single version of the requirement
const RequirementVersionSchema = new mongoose.Schema({
    versionNumber: {
        type: Number,
        required: true,
        default: 1
    },
    userId: { // User who created/modified this version
        type: String, // Or mongoose.Schema.Types.ObjectId if linking to a User collection
        required: false // Allow null if system generated
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },
    feature: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    type: { // 'F' or 'NF'
        type: String,
        required: false
    },
    priority: { // Numerical priority
        type: Number,
        required: false
    },
    moscow: { // 'M', 'S', 'C', 'W'
        type: String,
        required: false
    },
    notes: {
        type: String,
        required: false
    },
    status: { // e.g., 'draft', 'approved', 'deprecated'
        type: String,
        required: false,
        default: 'draft'
    },
    sourceInputId: { // Link to the source input document/URL
        type: String, // Or mongoose.Schema.Types.ObjectId if linking to a SourceInput collection
        required: false
    }
});

// Main schema for the logical requirement
const RequirementSchema = new mongoose.Schema({
    _id: { // Unique ID for the logical requirement
        type: String, // Using String for UUID compatibility
        default: uuidv4,
        required: true
    },
    projectId: {
        type: String, // Or mongoose.Schema.Types.ObjectId if linking to a Project collection
        required: true,
        index: true // Index for efficient querying by project
    },
    versions: { // Array of requirement versions
        type: [RequirementVersionSchema],
        required: true,
        default: []
    },
    latestVersionNumber: { // Helper field to quickly find the latest version
        type: Number,
        required: true,
        default: 1
    }
});

// Add a pre-save hook to update latestVersionNumber
RequirementSchema.pre('save', function(next) {
    if (this.versions && this.versions.length > 0) {
        // Sort versions by versionNumber descending and take the first one
        const latestVersion = this.versions.sort((a, b) => b.versionNumber - a.versionNumber)[0];
        this.latestVersionNumber = latestVersion.versionNumber;
    } else {
        this.latestVersionNumber = 0; // Or 1 if the first version is always 1
    }
    next();
});

const Requirement = mongoose.model('Requirement', RequirementSchema);

module.exports = Requirement;