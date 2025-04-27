const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const SingleRequirementSchema = new Schema({
  feature: { type: String, required: true },
  description: { type: String, required: true },
  priority:{type: String, enum: [1,2,3,4,5]}, // High, Medium, Low
  type: { type: String, enum: ['F', 'NF'], required: true }, // F = Functional, NF = Non-Functional
  moscow: { type: String, enum: ['M', 'S', 'C', 'W'],required:true}, // Must, Should, Could, Won't
  question: { type: String }, // clarification question
  answer: { type: String }
}, { _id: false }); // Prevents creating a separate _id for each subdocument

const RequirementSchema = new Schema({
  projectId: { type: Types.ObjectId, ref: 'Project', required: true, index: true },
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  requirements: { type: [SingleRequirementSchema], required: true },
}, {
  timestamps: true
});

module.exports = model('Requirement', RequirementSchema);
