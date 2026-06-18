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
import { ThemeProvider } from './context/ThemeContext'; // Import this
import CustomerBrowse from './features/dashboard/CustomerBrowse';
import Home from './pages/Home'; 


function App() {
  return (
    <AuthProvider>
      <ThemeProvider> {/* Add ThemeProvider wrapper */}
        <Router>
          {/* bg-gray-50 ko dark mode mein bg-gray-900 aur text-gray-900 ko dark:text-white kiya gaya hai */}
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col transition-colors duration-300">
            <Navbar />

            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
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
                  path="/browse-services" 
                  element={
                    <ProtectedRoute allowedRoles={['CUSTOMER']}>
                      <CustomerBrowse />
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
            </main>

            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;