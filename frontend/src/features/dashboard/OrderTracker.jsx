import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderTracker = ({ role }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    const endpoint = role === 'CUSTOMER' ? 'sent' : 'received';
    const res = await axios.get(`http://localhost:5000/api/requests/${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOrders(res.data.data);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    await axios.patch('http://localhost:5000/api/requests/update-status', 
      { requestId: id, status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert(`Order ${newStatus}`);
    fetchOrders();
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-md border">
      <h3 className="text-xl font-bold mb-4">{role === 'CUSTOMER' ? 'My Sent Requests' : 'Incoming Orders'}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs uppercase text-gray-500">
              <th className="p-3">Service</th>
              <th className="p-3">{role === 'CUSTOMER' ? 'Provider' : 'Customer'}</th>
              <th className="p-3">Budget</th>
              <th className="p-3">Status</th>
              {role === 'SERVICE_PROVIDER' && <th className="p-3">Action</th>}
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders.map(order => (
              <tr key={order._id} className="border-t">
                <td className="p-3 font-medium">{order.listing?.title}</td>
                <td className="p-3">{role === 'CUSTOMER' ? order.provider?.name : order.customer?.name}</td>
                <td className="p-3">${order.budget}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                    order.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                {role === 'SERVICE_PROVIDER' && (
                  <td className="p-3 space-x-2">
                    {order.status === 'Pending' && <button onClick={() => updateStatus(order._id, 'Accepted')} className="text-green-600 hover:underline">Accept</button>}
                    {order.status === 'Accepted' && <button onClick={() => updateStatus(order._id, 'In Progress')} className="text-blue-600 hover:underline">Start</button>}
                    {order.status === 'In Progress' && <button onClick={() => updateStatus(order._id, 'Delivered')} className="text-purple-600 hover:underline">Deliver</button>}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-4 text-center text-gray-400">No active orders found.</p>}
      </div>
    </div>
  );
};

export default OrderTracker;