import Review from './review.model.js';

// Add Review (Customer only)
export const addReview = async (req, res) => {
    try {
        const { providerId, rating, feedback } = req.body;
        
        if (!providerId || !rating || !feedback) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const newReview = await Review.create({
            customer: req.user.id,
            provider: providerId,
            rating,
            feedback
        });

        res.status(201).json({ success: true, message: 'Review submitted successfully!', data: newReview });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding review', error: error.message });
    }
};

// Get Provider Average Rating & Reviews (Public)
export const getProviderReviews = async (req, res) => {
    try {
        const { providerId } = req.params;
        const reviews = await Review.find({ provider: providerId }).populate('customer', 'name');
        
        // Calculate Average
        const totalReviews = reviews.length;
        const avgRating = totalReviews > 0 
            ? (reviews.reduce((acc, item) => acc + item.rating, 0) / totalReviews).toFixed(1) 
            : 0;

        res.status(200).json({ success: true, avgRating, totalReviews, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching reviews' });
    }
};