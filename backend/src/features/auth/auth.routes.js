// src/features/auth/auth.routes.js

import express from 'express';
import { registerUser, loginUser, logoutUser, updateProfile } from './auth.controller.js'; // updateProfile add karein
import { verifyToken } from '../../middlewares/auth.middleware.js'; // Import verification
import upload from '../../middlewares/upload.js'; // Import Multer

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// YEH NAYA ROUTE ADD KAREIN 👇 (Isme upload middleware lazmi hai image ke liye)
router.post('/update-profile', verifyToken, upload.single('profilePic'), updateProfile);

export default router;