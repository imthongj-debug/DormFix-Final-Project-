const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  message: { type: String, required: true, trim: true, maxlength: 300 },
  type: { type: String, enum: ['new_repair', 'status_update', 'assignment'], default: 'status_update' },
  repair: { type: mongoose.Schema.Types.ObjectId, ref: 'Repair', default: null },
  readAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

notificationSchema.index({ recipient: 1, createdAt: -1 });
module.exports = mongoose.model('Notification', notificationSchema);
