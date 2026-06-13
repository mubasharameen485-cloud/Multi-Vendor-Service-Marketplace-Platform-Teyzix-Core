import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
    {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
        requirements: { type: String, required: true },
        budget: { type: Number, required: true },
        deadline: { type: Date, required: true },
        status: {
            type: String,
            enum: ['Pending', 'Accepted', 'In Progress', 'Completed', 'Delivered'],
            default: 'Pending',
        },
    },
    { timestamps: true }
);

const ServiceRequest = mongoose.model('ServiceRequest', requestSchema);
export default ServiceRequest;