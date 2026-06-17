import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ProviderProfileForm from './ProviderProfileForm';
import axios from 'axios';
import ListingManager from './ListingManager';
import OrderTracker from './OrderTracker';
import ActivityLog from './ActivityLog'; // Added Import

const ProviderDashboard = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [ratingStats, setRatingStats] = useState({ avg: 0, total: 0 });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/provider/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setProfile(response.data.data);
      }
    } catch (error) {
      console.log("Profile not found");
    }
  };

  const fetchRating = async () => {
    try {
      const providerId = profile?.user?._id || user?.id;
      if (!providerId) return;
      
      const res = await axios.get(`http://localhost:5000/api/reviews/provider/${providerId}`);
      setRatingStats({ 
        avg: res.data.avgRating || 0, 
        total: res.data.totalReviews || 0 
      });
    } catch (err) {
      console.log("Rating fetch error", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile || user) fetchRating();
  }, [profile, user]);

  const handleSaveSuccess = () => {
    setIsEditing(false);
    fetchProfile(); 
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-8 rounded-xl shadow-lg mb-8">
        <h1 className="text-3xl font-bold italic">Teyzix Core Marketplace</h1>
        <p className="mt-2 text-green-100 uppercase tracking-widest text-sm font-semibold">Provider Dashboard</p>
      </div>

      {isEditing ? (
        <div>
          <button onClick={() => setIsEditing(false)} className="mb-4 text-green-700 dark:text-green-400 font-medium hover:underline">
            ← Back to Dashboard
          </button>
          <ProviderProfileForm onSuccess={handleSaveSuccess} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="md:flex">
              <div className="md:shrink-0 bg-gray-50 dark:bg-gray-900/50 p-6 flex justify-center items-center border-r dark:border-gray-700">
                {profile?.profilePicture ? (
                  <img className="h-32 w-32 object-cover rounded-full border-4 border-green-500 shadow-sm" src={profile.profilePicture} alt="Profile" />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 text-4xl font-bold">
                    {user?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="p-8 w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user?.name}</h2>
                    <p className="text-green-600 dark:text-green-400 font-medium">{profile?.experience || 'Professional Service Provider'}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
                  </div>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-green-600 hover:text-white transition-all font-medium"
                  >
                    Edit Profile
                  </button>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {profile?.skills?.map((skill, index) => (
                    <span key={index} className="bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-100 dark:border-green-800">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Stats Bar */}
            <div className="bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 grid grid-cols-2 md:grid-cols-4 divide-x dark:divide-gray-700 text-center py-4">
              <div className="py-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Hourly Rate</p>
                <p className="text-xl font-black text-gray-800 dark:text-white">${profile?.pricing || 0}</p>
              </div>
              <div className="py-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Rating</p>
                <p className="text-xl font-black text-yellow-500">⭐ {ratingStats.avg}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">({ratingStats.total} Reviews)</p>
              </div>
              <div className="py-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Projects</p>
                <p className="text-xl font-black text-gray-800 dark:text-white">{profile?.portfolio?.length || 0}</p>
              </div>
              <div className="py-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Status</p>
                <p className="text-xl font-black text-green-600 dark:text-green-400">Active</p>
              </div>
            </div>
          </div>

          <ListingManager />
          <OrderTracker role="SERVICE_PROVIDER" />

          {/* Activity Logs Section - Added Here */}
          <ActivityLog />
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;