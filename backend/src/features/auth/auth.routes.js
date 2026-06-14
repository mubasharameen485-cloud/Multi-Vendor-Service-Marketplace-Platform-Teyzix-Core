import express from 'express';
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    updateProfile 
} from './auth.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import upload from '../../middlewares/upload.js';

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Protected Route (Needs Token and Multer for Image)
router.post(
    '/update-profile', 
    verifyToken, 
    upload.single('profilePic'), 
    updateProfile
);

export default router;