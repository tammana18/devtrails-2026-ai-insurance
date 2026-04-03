const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  userId: String,
  reason: String,
  amount: Number,
  status: {
    type: String,
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);