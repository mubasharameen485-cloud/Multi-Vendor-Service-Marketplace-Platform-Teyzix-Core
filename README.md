# 🚀 Teyzix Core Marketplace Platform

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue)
![Socket.io](https://img.shields.io/badge/Socket.io-RealTime-black)
![Stripe](https://img.shields.io/badge/Stripe-Payments-indigo)

A complete Full-Stack Multi-Vendor Service Marketplace Platform built as part of the **Teyzix Core Internship (June Batch)**. This platform simulates real-world freelance systems like Fiverr and Upwork, connecting customers with trusted service providers.

## 🌟 Key Features

### Core Functionalities
- **Modular Monolith Architecture:** Backend is structured by domain/feature for high scalability and clean code.
- **Role-Based Authentication:** Secure JWT-based login/registration for Customers, Service Providers, and Admins.
- **Provider Profiles:** Providers can create profiles, add skills, set pricing, and upload pictures (Cloudinary).
- **Service Listings (Gigs):** Providers can create, edit, and delete their service offerings.
- **Service Request System:** Customers can browse, filter, search, and submit tailored requests with budgets and deadlines.
- **Project Tracking Workflow:** Real-time tracking from `Pending` -> `Accepted` -> `In Progress` -> `Delivered`.
- **Review & Rating System:** Customers can rate providers (1-5 stars) and leave feedback.
- **Admin Dashboard:** Live statistics of total users, active listings, and project statuses.

### 🚀 Bonus Challenges Achieved
- **Real-Time Chat:** Integrated **Socket.io** for live messaging between customers and providers (with message deletion capabilities).
- **Email Notifications:** Automated email alerts using **Nodemailer** for order status updates.
- **Payment Integration:** Secure checkout simulation using **Stripe**.
- **Dark Mode:** Seamless light/dark mode toggling using Tailwind CSS & Context API.
- **Activity Logs:** Automatic logging of user actions (login, profile updates, etc.) visible on dashboards.

## 🛠️ Tech Stack

**Frontend:** React.js, Tailwind CSS, React Router, Axios, React-Hook-Form, Lucide-React.
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt.
**Third-Party Services:** Cloudinary (Images), Stripe (Payments), Socket.io (WebSockets), Nodemailer (Emails).

## 📁 Folder Structure

```text
teyzix-marketplace/
│
├── backend/                  # Node.js & Express API
│   ├── src/
│   │   ├── config/           # DB, Cloudinary, Email, Stripe configs
│   │   ├── middlewares/      # JWT verification, Role authorization, Multer
│   │   ├── features/         # MODULAR DOMAINS
│   │   │   ├── auth/         
│   │   │   ├── provider/     
│   │   │   ├── listings/     
│   │   │   ├── requests/     
│   │   │   ├── reviews/      
│   │   │   ├── chat/         # Socket.io handlers
│   │   │   ├── payment/      # Stripe integration
│   │   │   └── activity/     # Activity Logging
│   │   └── server.js         # Entry point
│   └── .env
│
└── frontend/                 # React.js UI
    ├── src/
    │   ├── components/       # Navbar, Footer, ProtectedRoutes
    │   ├── context/          # AuthContext, ThemeContext
    │   ├── features/         
    │   │   ├── auth/         # Login, Register
    │   │   ├── dashboard/    # Admin, Provider, Customer Dashboards
    │   │   └── chat/         # Real-time chat UI
    │   ├── App.jsx
    │   └── main.jsx
    └── tailwind.config.js



===========================
⚙️ Installation & Setup
Prerequisites
Make sure you have Node.js and MongoDB installed on your system. You will also need accounts on Cloudinary and Stripe.
1. Clone the repository
code
Bash
git clone https://github.com/your-username/teyzix-marketplace.git
cd teyzix-marketplace
2. Backend Setup
code
Bash
cd backend
npm install
Create a .env file in the backend folder and add the following:
code
Env
PORT=5000
DATABASE_URL="mongodb://127.0.0.1:27017/teyzix_marketplace"
JWT_SECRET="your_jwt_secret_key"

# Admin Setup
ADMIN_EMAIL="admin@teyzix.com"
ADMIN_PASSWORD="super_secure_password"

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Stripe Setup
STRIPE_SECRET_KEY="sk_test_your_stripe_key"

# Nodemailer Setup
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_gmail_app_password"
Run the backend server:
code
Bash
npm run dev
3. Frontend Setup
Open a new terminal window.
code
Bash
cd frontend
npm install
Run the React development server:
code
Bash
npm run dev
Open http://localhost:5173 in your browser. The backend runs on http://localhost:5000.    