import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ProviderProfileForm from './ProviderProfileForm';
import axios from 'axios';
import ListingManager from './ListingManager';
const ProviderDashboard = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle between View and Edit

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

  useEffect(() => {
    fetchProfile();
  }, []);

  // Jab profile save ho jaye tou isay call karenge
  const handleSaveSuccess = () => {
    setIsEditing(false);
    fetchProfile(); // Naya data load karne ke liye
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-8 rounded-xl shadow-lg mb-8">
        <h1 className="text-3xl font-bold italic">Teyzix Core Marketplace</h1>
        <p className="mt-2 text-green-100 uppercase tracking-widest text-sm font-semibold">Provider Dashboard</p>
      </div>

      {isEditing ? (
        // EDIT MODE
        <div>
          <button 
            onClick={() => setIsEditing(false)}
            className="mb-4 text-green-700 font-medium hover:underline"
          >
            ← Back to Dashboard
          </button>
          <ProviderProfileForm onSuccess={handleSaveSuccess} />
        </div>
      ) : (
        // VIEW MODE (DASHBOARD)
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="md:flex">
              <div className="md:shrink-0 bg-gray-50 p-6 flex justify-center items-center border-r">
                {profile?.profilePicture ? (
                  <img className="h-32 w-32 object-cover rounded-full border-4 border-green-500 shadow-sm" src={profile.profilePicture} alt="Profile" />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-4xl font-bold">
                    {user?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="p-8 w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                    <p className="text-green-600 font-medium">{profile?.experience || 'Professional Service Provider'}</p>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                  </div>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-green-600 hover:text-white transition-all font-medium"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {profile?.skills?.map((skill, index) => (
                    <span key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Stats Bar */}
            <div className="bg-gray-50 border-t grid grid-cols-3 divide-x text-center py-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Hourly Rate</p>
                <p className="text-xl font-bold text-gray-800">${profile?.pricing || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Projects</p>
                <p className="text-xl font-bold text-gray-800">{profile?.portfolio?.length || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Status</p>
                <p className="text-xl font-bold text-green-600">Active</p>
              </div>
            </div>
          </div>

          {/* Portfolio Section */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Portfolio Projects</h3>
            {profile?.portfolio && profile.portfolio.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.portfolio.map((item, idx) => (
                  <div key={idx} className="p-4 border rounded-lg hover:border-green-400 transition-colors">
                    <p className="font-bold text-gray-700">{item.title}</p>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noreferrer" className="text-blue-500 text-xs hover:underline">
                        View Project ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">No portfolio projects added yet.</p>
            )}
            <ListingManager />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;