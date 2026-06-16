import Message from './chat.model.js';

// Get Chat History
export const getChatHistory = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const senderId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).sort({ createdAt: 1 }); 

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching chat history' });
    }
};

// Save a new message
export const saveMessage = async (req, res) => {
    try {
        const { receiverId, text } = req.body;
        const senderId = req.user.id;

        const newMessage = await Message.create({ sender: senderId, receiver: receiverId, text });
        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error saving message' });
    }
};

// Delete ONLY my own message
export const deleteMyMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const senderId = req.user.id;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        // Strong String comparison to avoid Object ID mismatch error
        if (String(message.sender) !== String(senderId)) {
            return res.status(403).json({ success: false, message: 'You can only delete your own messages.' });
        }

        await Message.findByIdAndDelete(messageId);
        res.status(200).json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting message' });
    }
};