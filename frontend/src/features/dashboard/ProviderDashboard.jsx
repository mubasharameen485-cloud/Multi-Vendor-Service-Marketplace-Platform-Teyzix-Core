import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ProviderProfileForm from './ProviderProfileForm';
import axios from 'axios';
import ListingManager from './ListingManager';
import OrderTracker from './OrderTracker';
import ActivityLog from './ActivityLog';

const ProviderDashboard = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [ratingStats, setRatingStats] = useState({ avg: 0, total: 0 });

  // 1. Fetch Profile Data
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

  // 2. Fetch Rating Stats
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
      console.log("Rating fetch error");
    }
  };

  useEffect(() => { fetchProfile(); }, []);
  useEffect(() => { if (profile || user) fetchRating(); }, [profile, user]);

  const handleSaveSuccess = () => {
    setIsEditing(false);
    fetchProfile(); 
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-10">
      
      {/* A. Professional Banner Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-900 text-white p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase">Teyzix Marketplace</h1>
          <p className="mt-2 text-green-100 font-bold uppercase tracking-[0.3em] text-xs">Service Provider Control Portal</p>
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 bg-green-500 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {isEditing ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border dark:border-gray-700 shadow-xl">
          <button onClick={() => setIsEditing(false)} className="mb-6 text-green-600 font-black uppercase hover:underline">
            ← Back to Control Panel
          </button>
          <ProviderProfileForm onSuccess={handleSaveSuccess} />
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* B. Profile & Stats Card */}
          <div className="bg-white dark:bg-gray-800 rounded-[35px] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="md:flex p-10 items-center gap-10">
              <div className="h-40 w-40 rounded-3xl overflow-hidden border-4 border-green-500 shadow-xl">
                <img className="h-full w-full object-cover" src={profile?.profilePicture || 'https://via.placeholder.com/150'} alt="Provider" />
              </div>
              <div className="flex-1 text-center md:text-left space-y-2">
                <h2 className="text-4xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">{user?.name}</h2>
                <p className="text-green-600 dark:text-green-400 font-black text-sm uppercase italic bg-green-50 dark:bg-green-900/30 px-4 py-1 rounded-full inline-block">
                  {profile?.experience || 'Professional Expert'}
                </p>
                <div className="pt-4">
                  <button onClick={() => setIsEditing(true)} className="bg-gray-900 dark:bg-gray-700 text-white px-8 py-3 rounded-2xl font-bold uppercase text-xs hover:bg-green-600 transition-all">
                    Update Portfolio & Skills
                  </button>
                </div>
              </div>
            </div>
            
            {/* Stats Bar */}
            <div className="bg-gray-50 dark:bg-gray-900/50 grid grid-cols-2 md:grid-cols-4 divide-x dark:divide-gray-700 border-t dark:border-gray-700 text-center py-10">
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Hourly Rate</p>
                <p className="text-3xl font-black dark:text-white">${profile?.pricing || 0}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Avg Rating</p>
                <p className="text-3xl font-black text-yellow-500">⭐ {ratingStats.avg}</p>
                <p className="text-[10px] text-gray-500 font-bold">({ratingStats.total} Reviews)</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Total Projects</p>
                <p className="text-3xl font-black dark:text-white">{profile?.portfolio?.length || 0}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Availability</p>
                <p className="text-3xl font-black text-green-500 italic font-serif">Active</p>
              </div>
            </div>
          </div>

          {/* C. Service Listings (Gigs) */}
          <ListingManager />

          {/* D. Orders & Payment Status */}
          <OrderTracker role="SERVICE_PROVIDER" />

          {/* E. Activity Logs */}
          <ActivityLog />

        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;