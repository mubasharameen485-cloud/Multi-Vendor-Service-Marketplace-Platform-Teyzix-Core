
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http'; // Naya Import
import { Server } from 'socket.io'; // Naya Import
import connectDB from './config/db.js';
import { setupAdminAccount } from './config/seedAdmin.js';

// Routes Imports
import authRoutes from './features/auth/auth.routes.js';
import customerRoutes from './features/customer/customer.routes.js';
import providerRoutes from './features/provider/provider.routes.js';
import adminRoutes from './features/admin/admin.routes.js';
import listingRoutes from './features/listings/listing.routes.js';
import requestRoutes from './features/requests/request.routes.js';
import reviewRoutes from './features/reviews/review.routes.js';
import chatRoutes from './features/chat/chat.routes.js'; // Naya Import
import activityRoutes from './features/activity/activity.routes.js';
import paymentRoutes from './features/payment/payment.routes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

// Socket.io Logic (Real-time events)
io.on('connection', (socket) => {
    console.log('User Connected: ', socket.id);

    
    socket.on('join_chat', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    
    socket.on('send_message', (data) => {
        io.to(data.room).emit('receive_message', data);
    });

    
    socket.on('delete_message', (data) => {
        io.to(data.room).emit('message_deleted', data.msgId);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected: ', socket.id);
    });
});

// Middlewares
app.use(express.json());
app.use(cors());

// Database connection
connectDB().then(() => {
    setupAdminAccount();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes); 
app.use('/api/activity', activityRoutes);
app.use('/api/payment', paymentRoutes);
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});