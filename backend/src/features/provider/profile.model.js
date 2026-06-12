import mongoose from 'mongoose';

const portfolioItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    link: { type: String }, // optional link to live project
});

const providerProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true, // One user can only have one profile
        },
        profilePicture: {
            type: String, // Cloudinary URL
            default: '',
        },
        skills: {
            type: [String], // Array of strings (e.g., ["React", "Node.js"])
            default: [],
        },
        experience: {
            type: String, // E.g., "5 years in Web Development"
            default: '',
        },
        pricing: {
            type: Number, // Hourly rate or base price
            default: 0,
        },
        portfolio: {
            type: [portfolioItemSchema], // Array of portfolio items
            default: [],
        },
    },
    { timestamps: true }
);

const ProviderProfile = mongoose.model('ProviderProfile', providerProfileSchema);
export default ProviderProfile;