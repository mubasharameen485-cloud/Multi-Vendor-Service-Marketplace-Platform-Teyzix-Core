import express from 'express';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware.js';

import {
  createRequest,
  getMySentRequests,
  getMyReceivedRequests,
  updateRequestStatus
} from './request.controller.js';

const router = express.Router();

// Customer Routes
router.post(
  '/',
  verifyToken,
  authorizeRoles('CUSTOMER'),
  createRequest
);

router.get(
  '/sent',
  verifyToken,
  authorizeRoles('CUSTOMER'),
  getMySentRequests
);

// Provider Routes
router.get(
  '/received',
  verifyToken,
  authorizeRoles('SERVICE_PROVIDER'),
  getMyReceivedRequests
);

router.patch(
  '/update-status',
  verifyToken,
  authorizeRoles('SERVICE_PROVIDER'),
  updateRequestStatus
);

export default router;