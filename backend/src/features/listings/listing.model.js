import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
    {
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            // Example: "Website Development", "Logo Design", "Social Media Management"
        },
        price: {
            type: Number,
            required: true,
        },
        deliveryTime: {
            type: String, // Example: "3 Days", "1 Week"
            required: true,
        },
    },
    { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;