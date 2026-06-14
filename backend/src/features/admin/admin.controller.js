import User from '../auth/auth.model.js';
import Listing from '../listings/listing.model.js';
import ServiceRequest from '../requests/request.model.js';

export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCustomers = await User.countDocuments({ role: 'CUSTOMER' });
        const totalProviders = await User.countDocuments({ role: 'SERVICE_PROVIDER' });
        
        const totalListings = await Listing.countDocuments();
        
        const totalRequests = await ServiceRequest.countDocuments();
        const pendingRequests = await ServiceRequest.countDocuments({ status: 'Pending' });
        const completedRequests = await ServiceRequest.countDocuments({ status: 'Completed' }); // Ya Delivered

        res.status(200).json({
            success: true,
            data: {
                users: { total: totalUsers, customers: totalCustomers, providers: totalProviders },
                services: { total: totalListings },
                projects: { total: totalRequests, pending: pendingRequests, completed: completedRequests }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching stats' });
    }
};