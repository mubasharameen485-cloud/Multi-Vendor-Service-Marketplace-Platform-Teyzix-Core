import User from '../auth/auth.model.js';
import Listing from '../listings/listing.model.js';
import ServiceRequest from '../requests/request.model.js';

export const getDashboardStats = async (req, res) => {
    try {
        // 1. Basic Stats
        const totalUsers = await User.countDocuments();
        const totalCustomers = await User.countDocuments({ role: 'CUSTOMER' });
        const totalProviders = await User.countDocuments({ role: 'SERVICE_PROVIDER' });
        const totalListings = await Listing.countDocuments();
        const totalRequests = await ServiceRequest.countDocuments();

        // 2. Fetch Full Lists for Admin Tables
        const allUsers = await User.find().select('-password').sort({ createdAt: -1 });
        const allRequests = await ServiceRequest.find()
            .populate('customer', 'name email')
            .populate('provider', 'name email')
            .populate('listing', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    users: { total: totalUsers, customers: totalCustomers, providers: totalProviders },
                    services: { total: totalListings },
                    projects: { total: totalRequests }
                },
                usersList: allUsers,
                projectsList: allRequests
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching admin data' });
    }
};

// Admin can delete a user (Control feature)
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'User removed from platform' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
};