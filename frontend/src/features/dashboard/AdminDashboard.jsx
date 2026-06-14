import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data.data);
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-xl">Loading Statistics...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Statistics */}
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
          <h2 className="text-xl font-bold text-gray-700 mb-4">User Statistics</h2>
          <p className="text-gray-600">Total Users: <span className="font-bold text-black">{stats?.users.total}</span></p>
          <p className="text-gray-600">Customers: <span className="font-bold text-blue-600">{stats?.users.customers}</span></p>
          <p className="text-gray-600">Providers: <span className="font-bold text-green-600">{stats?.users.providers}</span></p>
        </div>

        {/* Service Statistics */}
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Service Statistics</h2>
          <p className="text-gray-600">Total Gigs Listed: <span className="font-bold text-black">{stats?.services.total}</span></p>
        </div>

        {/* Project Statistics */}
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-purple-500">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Project Statistics</h2>
          <p className="text-gray-600">Total Requests: <span className="font-bold text-black">{stats?.projects.total}</span></p>
          <p className="text-gray-600">Pending: <span className="font-bold text-yellow-500">{stats?.projects.pending}</span></p>
          <p className="text-gray-600">Completed: <span className="font-bold text-green-600">{stats?.projects.completed}</span></p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;