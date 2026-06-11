import bcrypt from 'bcrypt';
import User from '../features/auth/auth.model.js';

export const setupAdminAccount = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        // Check if admin already exists
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            await User.create({
                name: 'Super Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
            });
            console.log(' Secure Admin account created successfully.');
        } else {
            console.log('Admin account is ready and secured.');
        }
    } catch (error) {
        console.error(' Error creating Admin account:', error.message);
    }
};