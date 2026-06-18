// src/features/auth/auth.model.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['CUSTOMER', 'SERVICE_PROVIDER', 'ADMIN'], default: 'CUSTOMER' },
        
        // YEH NAYA FIELD ADD KAREIN 👇
        profilePicture: { type: String, default: '' },
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;