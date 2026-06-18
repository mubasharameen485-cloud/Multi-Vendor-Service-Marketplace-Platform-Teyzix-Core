import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './auth.model.js';
import cloudinary from '../../config/cloudinary.js';
import { logActivity } from '../activity/activity.controller.js';
// Cloudinary Upload Helper
const streamUpload = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'teyzix_users' }, 
            (err, res) => {
                if (err) reject(err); 
                else resolve(res);
            }
        );
        stream.end(fileBuffer);
    });
};

// Handle user registration
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
        }

        if (role === 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Security Alert: You cannot register as an Admin.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ success: false, message: 'Email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'CUSTOMER'
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
};

// Handle user login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
 await logActivity(user._id, 'Logged In', 'User logged into the platform successfully.');
        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture || ''
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        let updateData = {};
        if (name) updateData.name = name;

        // Image upload logic with proper error capturing
        if (req.file) {
            try {
                const uploadResult = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { 
                            folder: 'teyzix_users',
                            resource_type: "auto" // Automatically detect file type
                        },
                        (error, result) => {
                            if (error) {
                                console.error("!!! CLOUDINARY UPLOAD ERROR !!!", error);
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                    stream.end(req.file.buffer);
                });
                updateData.profilePicture = uploadResult.secure_url;
            } catch (uploadErr) {
                // Agar Cloudinary fail ho tou yahin se wapas bhej do bajaye pooray server crash hone k
                return res.status(500).json({ 
                    success: false, 
                    message: 'Cloudinary upload failed. Check keys or connection.', 
                    error: uploadErr.message 
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await logActivity(userId, 'Updated Profile', 'Changed personal information or photo.');
        
        res.status(200).json({ success: true, data: updatedUser });

    } catch (error) {
        console.error("General Update Error:", error);
        res.status(500).json({ success: false, message: 'Server error in updating profile' });
    }
};
// Handle user logout
export const logoutUser = (req, res) => {
    return res.status(200).json({ success: true, message: 'Logged out successfully.' });
};