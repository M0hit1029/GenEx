const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const ClarificationQuestionSchema = new Schema({
    reqId:       { type: Types.ObjectId, ref: 'Requirement', required: true, index: true },
    text:        { type: String, required: true },
    role:        { type: String },    // e.g. 'ANALYST','SECURITY_EXPERT'
    answered:    { type: Boolean, default: false },
    answerText:  { type: String },
    createdAt:   { type: Date, default: Date.now },
    answeredAt:  { type: Date }
  });
  
  module.exports = model('ClarificationQuestion', ClarificationQuestionSchema);