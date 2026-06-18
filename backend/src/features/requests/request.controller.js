import ServiceRequest from './request.model.js';
import Listing from '../listings/listing.model.js';
import { logActivity } from '../activity/activity.controller.js';
import { sendEmailNotification } from '../../config/email.js';
// Customer: Submit a new service request
export const createRequest = async (req, res) => {
    try {
        const { listingId, requirements, budget, deadline } = req.body;

        const listing = await Listing.findById(listingId);
        if (!listing) return res.status(404).json({ success: false, message: 'Service not found' });

        const newRequest = await ServiceRequest.create({
            customer: req.user.id,
            provider: listing.provider,
            listing: listingId,
            requirements,
            budget,
            deadline,
        });
await logActivity(req.user.id, 'Sent Service Request', `Ordered service with budget $${budget}`);
        res.status(201).json({ success: true, message: 'Request submitted successfully', data: newRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error submitting request', error: error.message });
    }
};

// Customer: Get all requests sent by me
export const getMySentRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest.find({ customer: req.user.id })
            .populate('provider', 'name email')
            .populate('listing', 'title category')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching requests' });
    }
};

// Provider: Get all requests received by me
export const getMyReceivedRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest.find({ provider: req.user.id })
            .populate('customer', 'name email')
            .populate('listing', 'title category')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching received requests' });
    }
};
export const updateRequestStatus = async (req, res) => {
    try {
        const { requestId, status } = req.body;
        
        // Find request and populate customer email
        const request = await ServiceRequest.findById(requestId).populate('customer', 'name email');
        
        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

        request.status = status;
        await request.save();

        // 📧 SEND EMAIL NOTIFICATION TO CUSTOMER
        const emailSubject = `Order Status Updated: ${status}`;
        const emailText = `Hello ${request.customer.name},\n\nYour service request status has been updated to: ${status}.\n\nPlease check your Teyzix Dashboard for details.\n\nRegards,\nTeyzix Team`;
        
        // Asynchronously send email (don't await so API is fast)
        sendEmailNotification(request.customer.email, emailSubject, emailText);

        res.status(200).json({ success: true, message: `Status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating status' });
    }
};