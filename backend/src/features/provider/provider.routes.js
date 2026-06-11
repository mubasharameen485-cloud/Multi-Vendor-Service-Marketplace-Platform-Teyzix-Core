import express from 'express';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Route: GET /api/provider/dashboard
// Access: Only SERVICE_PROVIDER
router.get('/dashboard', verifyToken, authorizeRoles('SERVICE_PROVIDER'), (req, res) => {
    res.status(200).json({ success: true, message: 'Hello Provider, welcome to your dashboard!' });
});

export default router;