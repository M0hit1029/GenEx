const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const TenantSchema = new Schema({
  name:           { type: String, required: true },                    // e.g. 'Amazon Inc'
  normalizedName: { type: String, required: true, unique: true },     // e.g. 'amazon inc'
  joinCode:       { type: String, required: true, unique: true }      // e.g. 'AMZN123'
}, {
  timestamps: true
});

module.exports = model('Tenant', TenantSchema);
