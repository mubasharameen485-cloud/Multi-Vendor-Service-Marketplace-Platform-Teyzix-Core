import express from 'express';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { createCheckoutSession } from './payment.controller.js';

const router = express.Router();

router.post('/create-checkout-session', verifyToken, createCheckoutSession);

export default router;