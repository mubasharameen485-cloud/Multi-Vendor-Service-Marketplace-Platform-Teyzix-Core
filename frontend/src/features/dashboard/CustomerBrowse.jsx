import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatWindow from '../chat/ChatWindow'; // Chat Import

const CustomerBrowse = () => {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Request & Chat Modal States
  const [selectedListing, setSelectedListing] = useState(null);
  const [requestData, setRequestData] = useState({ requirements: '', budget: '', deadline: '' });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatPartner, setChatPartner] = useState(null);

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

  const filteredListings = listings.filter(item => {
    const query = searchTerm.toLowerCase();
    return item.title.toLowerCase().includes(query) || 
           item.description.toLowerCase().includes(query) || 
           item.category.toLowerCase().includes(query);
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
    } catch (err) {
      alert('Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      {/* Header & Search Bar wahi rahegi... */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Find Professional Services</h1>
        <div className="relative max-w-2xl mx-auto">
          <input 
            type="text" 
            placeholder="Search for React, Logo, etc..." 
            className="w-full p-4 pl-12 border-2 border-green-500 rounded-full shadow-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredListings.map(listing => (
          <div key={listing._id} className="bg-white border rounded-2xl shadow-sm p-6 flex flex-col justify-between hover:shadow-xl transition">
            <div>
              <span className="text-[10px] font-black tracking-widest text-green-700 bg-green-50 px-3 py-1 rounded-full uppercase italic">
                {listing.category}
              </span>
              <h3 className="text-xl font-bold mt-4 text-gray-800">{listing.title}</h3>
              <p className="text-gray-500 text-sm mt-3 line-clamp-2">{listing.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center mb-4 text-sm font-bold">
                <span className="text-green-600 font-black text-xl">${listing.price}</span>
                <span className="text-gray-400 font-medium italic">⏱ {listing.deliveryTime}</span>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedListing(listing)}
                  className="flex-[4] bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition shadow-md"
                >
                  Hire Professional
                </button>
                
                {/* CHAT ICON BUTTON */}
                <button 
                  onClick={() => {
                    setChatPartner({ id: listing.provider?._id, name: listing.provider?.name });
                    setIsChatOpen(true);
                  }}
                  className="flex-1 bg-blue-50 text-blue-600 flex items-center justify-center rounded-xl hover:bg-blue-600 hover:text-white transition"
                  title="Chat with provider"
                >
                  💬
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ORDER REQUEST MODAL - Wahi purana logic */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[100]">
          {/* ... Modal Content wahi ... */}
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
             <h2 className="text-2xl font-bold mb-4">Request: {selectedListing.title}</h2>
             <form onSubmit={handleRequestSubmit} className="space-y-4">
                <textarea className="w-full border p-2 rounded" rows="3" placeholder="Requirements..." required 
                   onChange={e => setRequestData({...requestData, requirements: e.target.value})} />
                <input className="w-full border p-2 rounded" type="number" placeholder="Budget ($)" required 
                   onChange={e => setRequestData({...requestData, budget: e.target.value})} />
                <input className="w-full border p-2 rounded" type="date" required 
                   onChange={e => setRequestData({...requestData, deadline: e.target.value})} />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setSelectedListing(null)} className="w-1/2 bg-gray-100 py-2 rounded font-bold">Cancel</button>
                  <button type="submit" className="w-1/2 bg-green-600 text-white py-2 rounded font-bold">Send</button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* CHAT WINDOW MODAL */}
      {isChatOpen && chatPartner && (
        <ChatWindow 
          receiverId={chatPartner.id} 
          receiverName={chatPartner.name} 
          onClose={() => setIsChatOpen(false)} 
        />
      )}
    </div>
  );
};

export default CustomerBrowse;