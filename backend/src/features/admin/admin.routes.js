import express from 'express';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Route: GET /api/admin/dashboard
// Access: Only ADMIN
router.get('/dashboard', verifyToken, authorizeRoles('ADMIN'), (req, res) => {
    res.status(200).json({ success: true, message: 'Hello Admin, welcome to your dashboard!' });
});

export default router;