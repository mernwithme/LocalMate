import Message from '../models/Message.js';
import User from '../models/User.js';

export const getMessages = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const recipientId = req.params.recipientId;

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: recipientId },
        { sender: recipientId, recipient: userId },
      ],
    })
      .populate('sender', 'name avatar')
      .populate('recipient', 'name avatar')
      .sort({ createdAt: 1 });

    await Message.updateMany({ sender: recipientId, recipient: userId, read: false }, { read: true });

    res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { recipientId, content, image } = req.body;

    if (!recipientId || (!content && !image)) {
      return res.status(400).json({ success: false, message: 'Recipient and message content are required.' });
    }

    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      content: content ? content.trim() : '',
      image: image || '',
    });

    const populatedMessage = await message.populate([
      { path: 'sender', select: 'name avatar' },
      { path: 'recipient', select: 'name avatar' },
    ]);

    res.status(201).json({ success: true, message: populatedMessage });
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .populate('sender', 'name avatar role bio rating')
      .populate('recipient', 'name avatar role bio rating')
      .sort({ createdAt: -1 });

    const contactMap = new Map();

    messages.forEach((msg) => {
      if (!msg.sender || !msg.recipient) return;
      const otherUser = msg.sender._id.toString() === userId.toString() ? msg.recipient : msg.sender;
      if (!otherUser || !otherUser._id) return;

      if (!contactMap.has(otherUser._id.toString())) {
        contactMap.set(otherUser._id.toString(), {
          user: otherUser,
          lastMessage: msg.content,
          createdAt: msg.createdAt,
          unread: !msg.read && msg.recipient._id.toString() === userId.toString(),
        });
      }
    });

    const contacts = Array.from(contactMap.values());
    res.json({ success: true, contacts });
  } catch (error) {
    next(error);
  }
};
