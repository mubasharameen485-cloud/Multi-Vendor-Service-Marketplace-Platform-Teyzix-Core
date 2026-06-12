import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListingManager = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', price: '', deliveryTime: ''
  });

  const fetchMyListings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/listings/my-listings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setListings(res.data.data);
    } catch (err) {
      console.error("Error fetching listings", err);
    }
  };

  useEffect(() => { fetchMyListings(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/listings', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Service added successfully!");
      setFormData({ title: '', description: '', category: '', price: '', deliveryTime: '' });
      setShowForm(false);
      fetchMyListings();
    } catch (err) {
      alert("Error adding listing");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMyListings();
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <div className="mt-10 bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">My Service Listings (Gigs)</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : '+ Add New Service'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg border space-y-3">
          <input type="text" placeholder="Service Title (e.g. Professional Web Design)" className="w-full p-2 border rounded" required
            value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          
          <textarea placeholder="Service Description" className="w-full p-2 border rounded" required
            value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Category" className="p-2 border rounded" required
              value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
            <input type="number" placeholder="Price ($)" className="p-2 border rounded" required
              value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
            <input type="text" placeholder="Delivery (e.g. 3 Days)" className="p-2 border rounded" required
              value={formData.deliveryTime} onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})} />
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">
            {loading ? 'Creating...' : 'Publish Service'}
          </button>
        </form>
      )}

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map((list) => (
          <div key={list._id} className="border p-4 rounded-lg flex justify-between items-start hover:shadow-sm transition">
            <div>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">{list.category}</span>
              <h4 className="font-bold text-gray-800 mt-1">{list.title}</h4>
              <p className="text-sm text-gray-500 line-clamp-1">{list.description}</p>
              <div className="mt-2 text-sm font-semibold">
                <span className="text-green-600">${list.price}</span> 
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-gray-500">⏱ {list.deliveryTime}</span>
              </div>
            </div>
            <button onClick={() => handleDelete(list._id)} className="text-red-400 hover:text-red-600 text-sm">Delete</button>
          </div>
        ))}
        {listings.length === 0 && <p className="text-gray-400 italic">No services listed yet.</p>}
      </div>
    </div>
  );
};

export default ListingManager;