import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewProvider from './ReviewProvider';
import ChatWindow from '../chat/ChatWindow';

const OrderTracker = ({ role }) => {
  const [orders, setOrders] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatPartner, setChatPartner] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = role === 'CUSTOMER' ? 'sent' : 'received';
      const res = await axios.get(`http://localhost:5000/api/requests/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.data);
    } catch (err) {
      console.error("Fetch orders failed", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:5000/api/requests/update-status', 
        { requestId: id, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Order updated to: ${newStatus}`);
      fetchOrders();
    } catch (err) {
      alert("Status update failed");
    }
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        {role === 'CUSTOMER' ? 'My Sent Requests' : 'Incoming Orders'}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400">
              <th className="p-3">Service</th>
              <th className="p-3">{role === 'CUSTOMER' ? 'Provider' : 'Customer'}</th>
              <th className="p-3">Budget</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders.map((order) => (
              <tr key={order._id} className="border-t border-gray-100 dark:border-gray-700">
                <td className="p-3 font-medium text-gray-700 dark:text-gray-200">{order.listing?.title}</td>
                <td className="p-3 dark:text-gray-300">{role === 'CUSTOMER' ? order.provider?.name : order.customer?.name}</td>
                <td className="p-3 font-semibold text-gray-800 dark:text-gray-100">${order.budget}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                    order.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                    order.status === 'Delivered' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-3 flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const pId = role === 'CUSTOMER' ? order.provider?._id : order.customer?._id;
                      const pName = role === 'CUSTOMER' ? order.provider?.name : order.customer?.name;
                      setChatPartner({ id: pId, name: pName });
                      setIsChatOpen(true);
                    }}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded text-xs font-bold hover:bg-green-600 hover:text-white transition"
                  >
                    Chat 💬
                  </button>

                  {role === 'SERVICE_PROVIDER' && (
                    <div className="space-x-2">
                      {order.status === 'Pending' && <button onClick={() => updateStatus(order._id, 'Accepted')} className="text-green-600 dark:text-green-400 hover:underline font-medium text-xs">Accept</button>}
                      {order.status === 'Accepted' && <button onClick={() => updateStatus(order._id, 'In Progress')} className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs">Start</button>}
                      {order.status === 'In Progress' && <button onClick={() => updateStatus(order._id, 'Delivered')} className="text-purple-600 dark:text-purple-400 hover:underline font-medium text-xs">Deliver</button>}
                    </div>
                  )}

                  {role === 'CUSTOMER' && order.status === 'Delivered' && (
                    <button 
                      onClick={() => { setSelectedOrder(order); setShowReviewModal(true); }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-yellow-600 transition"
                    >
                      Rate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-10 text-center text-gray-400 italic">No orders found.</p>}
      </div>

      {showReviewModal && selectedOrder && (
        <ReviewProvider 
          providerId={selectedOrder.provider?._id} 
          providerName={selectedOrder.provider?.name} 
          onClose={() => { setShowReviewModal(false); fetchOrders(); }} 
        />
      )}

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

export default OrderTracker;