import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './features/auth/auth.routes.js';
import customerRoutes from './features/customer/customer.routes.js';
import providerRoutes from './features/provider/provider.routes.js';
import adminRoutes from './features/admin/admin.routes.js';
import { setupAdminAccount } from './config/seedAdmin.js';
import listingRoutes from './features/listings/listing.routes.js';
import requestRoutes from './features/requests/request.routes.js';
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(express.json());
app.use(cors());

// Database connection
connectDB().then(() => {
    setupAdminAccount(); // Create admin if it doesn't exist
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/listings', listingRoutes);
// Root endpoint for testing
app.use('/api/requests', requestRoutes);
app.get('/', (req, res) => {
    res.send('Teyzix Core Marketplace API is running...');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});