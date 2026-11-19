const express = require('express');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

// Return only notifications belonging to the signed-in user.
router.get('/', async (req, res, next) => {
  try {
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ recipient: req.user._id })
        .populate('repair', 'ticketNo subject status')
        .sort({ createdAt: -1 })
        .limit(30),
      Notification.countDocuments({ recipient: req.user._id, readAt: null })
    ]);
    res.json({ notifications, unreadCount });
  } catch (e) { next(e); }
});

router.patch('/read-all', async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, readAt: null },
      { $set: { readAt: new Date() } }
    );
    res.json({ message: 'อ่านการแจ้งเตือนทั้งหมดแล้ว' });
  } catch (e) { next(e); }
});

router.patch('/:id/read', async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id, readAt: null },
      { $set: { readAt: new Date() } },
      { new: true }
    );
    if (!notification) {
      const existing = await Notification.findOne({ _id: req.params.id, recipient: req.user._id });
      if (!existing) return res.status(404).json({ message: 'ไม่พบการแจ้งเตือน' });
      return res.json({ notification: existing, message: 'อ่านการแจ้งเตือนแล้ว' });
    }
    res.json({ notification, message: 'อ่านการแจ้งเตือนแล้ว' });
  } catch (e) { next(e); }
});

module.exports = router;
