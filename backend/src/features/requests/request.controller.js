import ServiceRequest from './request.model.js';
import Listing from '../listings/listing.model.js';
import { logActivity } from '../activity/activity.controller.js';

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
        
        // Status transitions validate karein (optional)
        const validStatuses = ['Accepted', 'In Progress', 'Completed', 'Delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status update' });
        }

        const updatedReq = await ServiceRequest.findOneAndUpdate(
            { _id: requestId, provider: req.user.id }, // Sirf provider hi update kar sake
            { status },
            { new: true }
        );

        if (!updatedReq) return res.status(404).json({ success: false, message: 'Request not found' });
await logActivity(req.user.id, 'Updated Order Status', `Marked order as ${status}`);

        res.status(200).json({ success: true, message: `Order marked as ${status}`, data: updatedReq });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Update failed', error: error.message });
    }
};