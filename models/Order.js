const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: String,
  receiverName: String,
  destination: String,
  pickupStation: String,
  packageDetails: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Order', orderSchema);