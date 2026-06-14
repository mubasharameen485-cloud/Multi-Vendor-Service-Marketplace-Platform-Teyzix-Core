import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        feedback: { type: String, required: true }
    },
    { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;