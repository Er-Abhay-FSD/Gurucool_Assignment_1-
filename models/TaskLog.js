const mongoose = require('mongoose');

const taskLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now }
});

const TaskLog = mongoose.model('TaskLog', taskLogSchema);

module.exports = TaskLog;
