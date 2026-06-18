import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import OrderTracker from './OrderTracker';
import axios from 'axios';
import ActivityLog from './ActivityLog';

const CustomerDashboard = () => {
  const { user, updateUserData } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Image Preview Logic
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', name);
      if (file) {
        formData.append('profilePic', file); // 'profilePic' matches Backend Multer
      }

      const res = await axios.post('http://localhost:5000/api/auth/update-profile', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        // Backend returns the FULL updated user object
        // updateUserData will update LocalStorage AND React State
        updateUserData(res.data.data); 
        alert("✅ Profile & Photo Updated Successfully!");
        setIsEditing(false);
        setFile(null);
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert("❌ Update failed. Please try a smaller image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-10">
      
      {/* 1. Header Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-[30px] shadow-xl border border-gray-100 dark:border-gray-700 p-8 flex flex-col md:flex-row items-center gap-8 border-l-[12px] border-l-blue-600 transition-all">
        <div className="relative group">
          <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white text-5xl font-black overflow-hidden border-4 border-white dark:border-gray-900 shadow-2xl transition-transform group-hover:scale-105">
            {/* Displaying Image from AuthContext.user */}
            {user?.profilePicture ? (
              <img src={user.profilePicture} className="h-full w-full object-cover" alt="Profile" />
            ) : (
              user?.name?.charAt(0)
            )}
          </div>
          <div className="absolute bottom-1 right-1 h-6 w-6 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">
            {user?.name || "Customer"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg mt-1">{user?.email}</p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
            <button 
              onClick={() => { setIsEditing(!isEditing); setName(user?.name); }} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              {isEditing ? '✖ Close Editor' : '✏️ Edit Profile & Photo'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Advanced Editing Form */}
      {isEditing && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-blue-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-3 font-serif italic">
            Update Your Settings
          </h3>
          
          <form onSubmit={handleUpdate} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 text-lg font-bold dark:text-white transition-all" 
                />
              </div>

              {/* File Input & Preview */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Profile Image</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])} 
                    className="flex-1 p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl text-gray-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700" 
                  />
                  {preview && (
                    <div className="h-16 w-16 rounded-xl overflow-hidden border-2 border-blue-500 shadow-md animate-bounce">
                      <img src={preview} className="h-full w-full object-cover" alt="Preview" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t dark:border-gray-700 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className={`px-12 py-4 rounded-2xl font-black text-white shadow-xl transition-all transform active:scale-95 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {loading ? '⚡ SYNCING WITH CLOUDINARY...' : '💾 SAVE ALL CHANGES'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Orders & Tracking */}
      <div className="space-y-6">
        <h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tighter uppercase font-serif italic underline decoration-blue-500 decoration-4 underline-offset-8">My Projects</h2>
        <OrderTracker role="CUSTOMER" />
      </div>

      {/* 4. Activity Logs */}
      <div className="space-y-6 pt-4">
        <h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tighter uppercase font-serif italic underline decoration-green-500 decoration-4 underline-offset-8">Timeline</h2>
        <ActivityLog />
      </div>

    </div>
  );
};

export default CustomerDashboard;