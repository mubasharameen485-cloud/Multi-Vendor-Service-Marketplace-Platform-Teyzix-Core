import express from 'express';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { getMyActivities } from './activity.controller.js';

const router = express.Router();
router.get('/', verifyToken, getMyActivities);

export default router;