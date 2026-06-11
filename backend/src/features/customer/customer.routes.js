import express from 'express';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Route: GET /api/customer/dashboard
// Access: Only CUSTOMER
router.get('/dashboard', verifyToken, authorizeRoles('CUSTOMER'), (req, res) => {
    res.status(200).json({ success: true, message: 'Hello Customer, welcome to your dashboard!' });
});

export default router;