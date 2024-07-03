const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Queue = mongoose.model('Queue', queueSchema);

module.exports = Queue;
