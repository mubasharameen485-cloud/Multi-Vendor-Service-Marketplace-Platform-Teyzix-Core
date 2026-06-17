import Activity from './activity.model.js';


export const getMyActivities = async (req, res) => {
    try {
        
        const logs = await Activity.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching activity logs' });
    }
};


export const logActivity = async (userId, action, details = '') => {
    try {
        await Activity.create({ user: userId, action, details });
    } catch (error) {
        console.error('Failed to log activity:', error.message);
    }
};