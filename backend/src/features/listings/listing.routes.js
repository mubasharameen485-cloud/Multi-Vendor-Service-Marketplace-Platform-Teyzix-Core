import express from 'express';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware.js';
import { 
    createListing, 
    getMyListings, 
    updateListing, 
    deleteListing, 
    getAllListings 
} from './listing.controller.js';

const router = express.Router();

// Public/Customer route (To browse services)
router.get('/all', getAllListings);

// Protected routes for Service Provider
router.post('/', verifyToken, authorizeRoles('SERVICE_PROVIDER'), createListing);
router.get('/my-listings', verifyToken, authorizeRoles('SERVICE_PROVIDER'), getMyListings);
router.put('/:id', verifyToken, authorizeRoles('SERVICE_PROVIDER'), updateListing);
router.delete('/:id', verifyToken, authorizeRoles('SERVICE_PROVIDER'), deleteListing);

export default router;