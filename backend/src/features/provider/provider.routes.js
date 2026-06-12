import express from 'express';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware.js';
import { manageProfile, getMyProfile } from './provider.controller.js'; // 1. Controllers import karein
import upload from '../../middlewares/upload.js'; // 2. Multer upload import karein

const router = express.Router();

// Get Profile Route
router.get(
  '/profile',
  verifyToken, 
  authorizeRoles('SERVICE_PROVIDER'), 
  getMyProfile // 3. Yahan dummy function ki jagah controller use karein
);

// Create/Update Profile Route
router.post(
  '/profile',
  verifyToken,
  authorizeRoles('SERVICE_PROVIDER'),
  upload.single('profilePic'), // 4. Ye middleware zaroori hai images ke liye
  manageProfile // 5. Yahan dummy function ki jagah controller use karein
);

export default router;