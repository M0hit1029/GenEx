const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const ProjectSchema = new Schema({
    name:        { type: String, required: true },
    description: { type: String },
    createdAt:   { type: Date, default: Date.now },
    updatedAt:   { type: Date, default: Date.now },
    userId:      { type: Types.ObjectId,  required:true,ref: 'User', index: true },
  }, {
    timestamps: true
  });
  module.exports = model('Project', ProjectSchema);