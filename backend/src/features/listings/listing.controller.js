import Listing from './listing.model.js';

// CREATE: Add a new service listing
export const createListing = async (req, res) => {
    try {
        const { title, description, category, price, deliveryTime } = req.body;

        if (!title || !description || !category || !price || !deliveryTime) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const newListing = await Listing.create({
            provider: req.user.id,
            title,
            description,
            category,
            price,
            deliveryTime,
        });

        res.status(201).json({ success: true, message: 'Listing created successfully', data: newListing });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating listing', error: error.message });
    }
};

// GET: Fetch all listings of the logged-in Provider
export const getMyListings = async (req, res) => {
    try {
        const listings = await Listing.find({ provider: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: listings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching your listings', error: error.message });
    }
};

// UPDATE: Edit a listing
export const updateListing = async (req, res) => {
    try {
        const listingId = req.params.id;
        
        
        let listing = await Listing.findOne({ _id: listingId, provider: req.user.id });

        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found or unauthorized' });
        }

        listing = await Listing.findByIdAndUpdate(listingId, req.body, { new: true, runValidators: true });

        res.status(200).json({ success: true, message: 'Listing updated successfully', data: listing });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating listing', error: error.message });
    }
};

// DELETE: Remove a listing
export const deleteListing = async (req, res) => {
    try {
        const listingId = req.params.id;

        const listing = await Listing.findOneAndDelete({ _id: listingId, provider: req.user.id });

        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found or unauthorized' });
        }

        res.status(200).json({ success: true, message: 'Listing deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting listing', error: error.message });
    }
};

// GET: Fetch ALL listings (Public/Customers can browse)
export const getAllListings = async (req, res) => {
    try {
    
        const listings = await Listing.find().populate('provider', 'name email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: listings.length, data: listings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching listings', error: error.message });
    }
};