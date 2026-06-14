import express from 'express';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware.js';
import { addReview, getProviderReviews } from './review.controller.js';

const router = express.Router();

router.post('/', verifyToken, authorizeRoles('CUSTOMER'), addReview);
router.get('/provider/:providerId', getProviderReviews);

export default router;