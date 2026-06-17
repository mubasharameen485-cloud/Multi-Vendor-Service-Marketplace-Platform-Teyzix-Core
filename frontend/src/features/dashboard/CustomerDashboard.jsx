import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import OrderTracker from './OrderTracker';
import axios from 'axios';
import ActivityLog from './ActivityLog'; // Added Import

const CustomerDashboard = () => {
  const { user, updateUserData } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', name);
      if (file) formData.append('profilePic', file);

      const res = await axios.post('http://localhost:5000/api/auth/update-profile', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        updateUserData(res.data.data); 
        alert("Profile Updated Successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert("Failed to update. Check your internet/keys.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      {/* Header Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border p-6 mb-8 flex items-center gap-6 border-l-8 border-l-blue-600 dark:border-gray-700 transition-colors">
        <div className="h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden border-4 border-gray-100 dark:border-gray-900 shadow-lg">
          {user?.profilePicture ? (
            <img src={user.profilePicture} className="h-full w-full object-cover" alt="Profile" />
          ) : (
            user?.name?.charAt(0)
          )}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">Hello, {user?.name}!</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">{user?.email}</p>
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="mt-3 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 px-4 py-1 rounded-full text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
          >
            {isEditing ? '✖ Cancel Editing' : '✏️ Edit Profile Info'}
          </button>
        </div>
      </div>

      {/* Modern Editing Form */}
      {isEditing && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl mb-10 border border-blue-50 dark:border-gray-700 animate-in fade-in duration-500">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
            Profile Settings
          </h3>
          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-lg font-semibold dark:text-white" 
                placeholder="Enter your name" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase">Profile Picture</label>
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files[0])} 
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-gray-500 dark:text-gray-400" 
              />
            </div>
            <div className="md:col-span-2 pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full md:w-auto px-12 py-4 rounded-xl font-black text-white shadow-lg transition-all transform active:scale-95 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {loading ? '⚡ PROCESSING...' : '💾 SAVE CHANGES'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Orders/Tracking Section */}
      <div className="mt-12">
        <OrderTracker role="CUSTOMER" />
      </div>

      {/* Activity Logs Section - Added Here */}
      <ActivityLog />
    </div>
  );
};

export default CustomerDashboard;