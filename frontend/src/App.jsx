import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import CustomerDashboard from './features/dashboard/CustomerDashboard';
import ProviderDashboard from './features/dashboard/ProviderDashboard';
import AdminDashboard from './features/dashboard/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const Home = () => (
  <div className="p-8 text-center">
    <h1 className="text-3xl font-bold">Welcome to Teyzix Marketplace</h1>
    <p className="text-gray-600 mt-2">Find trusted service providers for your business.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes - Role Based */}
            <Route 
              path="/customer-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/provider-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['SERVICE_PROVIDER']}>
                  <ProviderDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;