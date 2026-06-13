import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerBrowse = () => {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Request Modal State
  const [selectedListing, setSelectedListing] = useState(null);
  const [requestData, setRequestData] = useState({ requirements: '', budget: '', deadline: '' });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/listings/all');
        setListings(res.data.data);
      } catch (err) {
        console.error("Error fetching listings", err);
      }
    };
    fetchListings();
  }, []);

  // --- ADVANCED SEARCH LOGIC ---
  const filteredListings = listings.filter(item => {
    const query = searchTerm.toLowerCase();
    
    // Check Title, Description, and Category all at once
    const matchesTitle = item.title.toLowerCase().includes(query);
    const matchesDesc = item.description.toLowerCase().includes(query);
    const matchesCategory = item.category.toLowerCase().includes(query);

    return matchesTitle || matchesDesc || matchesCategory;
  });

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/requests', {
        listingId: selectedListing._id,
        ...requestData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Service Request Submitted Successfully!');
      setSelectedListing(null);
      setRequestData({ requirements: '', budget: '', deadline: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      {/* Search Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Find the Perfect Professional Service</h1>
        <p className="text-gray-600 mb-8">Search for web development, design, writing, and more.</p>
        
        {/* Modern Advanced Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <input 
            type="text" 
            placeholder="Try searching for 'React', 'Logo', or 'Content Writing'..." 
            className="w-full p-4 pl-12 border-2 border-green-500 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-green-100 transition-all text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredListings.map(listing => (
          <div key={listing._id} className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black tracking-widest text-green-700 bg-green-50 px-3 py-1 rounded-full uppercase border border-green-100">
                {listing.category}
              </span>
              <h3 className="text-xl font-bold mt-4 text-gray-800 group-hover:text-green-600 transition-colors">{listing.title}</h3>
              <p className="text-gray-500 text-sm mt-3 line-clamp-3 leading-relaxed">{listing.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50">
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Budget Starts At</span>
                  <span className="text-2xl font-black text-gray-800">${listing.price}</span>
                </div>
                <div className="text-right">
                   <span className="text-xs text-gray-400 block font-bold uppercase tracking-tighter">Delivery</span>
                   <span className="text-sm font-semibold text-gray-700">⏱ {listing.deliveryTime}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedListing(listing)}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-green-600 transform active:scale-95 transition-all shadow-md"
              >
                Hire this Professional
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Illustration */}
      {filteredListings.length === 0 && (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🔍</p>
          <h3 className="text-xl font-bold text-gray-800">No services found matching "{searchTerm}"</h3>
          <p className="text-gray-500">Try checking your spelling or use different keywords.</p>
        </div>
      )}

      {/* Request Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">New Service Order</h2>
            <p className="text-sm text-gray-500 mb-6">Service: <span className="text-green-600 font-bold">{selectedListing.title}</span></p>
            
            <form onSubmit={handleRequestSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Detailed Requirements</label>
                <textarea required rows="4" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 text-sm" placeholder="Please provide specific details about your project needs..."
                  value={requestData.requirements} onChange={e => setRequestData({...requestData, requirements: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Budget ($)</label>
                  <input required type="number" className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 font-bold" 
                    value={requestData.budget} onChange={e => setRequestData({...requestData, budget: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Expected Date</label>
                  <input required type="date" className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500" 
                    value={requestData.deadline} onChange={e => setRequestData({...requestData, deadline: e.target.value})} />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setSelectedListing(null)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition">Cancel</button>
                <button type="submit" disabled={loading} className="flex-[2] bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200">{loading ? 'Processing...' : 'Send Request'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerBrowse;