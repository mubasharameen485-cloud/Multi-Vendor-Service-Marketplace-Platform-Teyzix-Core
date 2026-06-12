import ProviderProfile from './profile.model.js';
import cloudinary from '../../config/cloudinary.js';

// Convert stream to upload file to Cloudinary with explicit error handling
const streamUpload = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'teyzix_profiles' }, // Ek folder ban jayega cloudinary pe
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Error:", error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        stream.end(fileBuffer);
    });
};

// Create or Update Provider Profile
export const manageProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { skills, experience, pricing, portfolio } = req.body;

        
        let parsedSkills = skills ? (typeof skills === 'string' ? JSON.parse(skills) : skills) : undefined;
        let parsedPortfolio = portfolio ? (typeof portfolio === 'string' ? JSON.parse(portfolio) : portfolio) : undefined;

        // Handle profile picture 
        let profilePictureUrl = undefined;
        if (req.file) {
            const uploadResult = await streamUpload(req.file.buffer);
            profilePictureUrl = uploadResult.secure_url;
        }

        
        let profile = await ProviderProfile.findOne({ user: userId });

        if (profile) {
            
            profile.skills = parsedSkills || profile.skills;
            profile.experience = experience || profile.experience;
            profile.pricing = pricing || profile.pricing;
            if (parsedPortfolio) profile.portfolio = parsedPortfolio;
            if (profilePictureUrl) profile.profilePicture = profilePictureUrl;

            await profile.save();
            return res.status(200).json({ success: true, message: 'Profile updated successfully', data: profile });
        } else {
            // Create new profile
            profile = await ProviderProfile.create({
                user: userId,
                skills: parsedSkills || [],
                experience: experience || '',
                pricing: pricing || 0,
                portfolio: parsedPortfolio || [],
                profilePicture: profilePictureUrl || '',
            });
            return res.status(201).json({ success: true, message: 'Profile created successfully', data: profile });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error in managing profile', error: error.message });
    }
};

// Get Current Provider's Profile
export const getMyProfile = async (req, res) => {
    try {
        const profile = await ProviderProfile.findOne({ user: req.user.id }).populate('user', 'name email');
        
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found. Please create one.' });
        }

        return res.status(200).json({ success: true, data: profile });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error in fetching profile', error: error.message });
    }
};