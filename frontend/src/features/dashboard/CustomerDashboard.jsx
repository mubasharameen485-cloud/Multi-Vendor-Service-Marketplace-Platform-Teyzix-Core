import React from 'react';
import OrderTracker from './OrderTracker';
const CustomerDashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600">Hello Customer!</h1>
      <p className="mt-2 text-gray-600">Welcome to your dashboard. Yahan aap services browse aur hire karenge.</p>
    <OrderTracker role="CUSTOMER" />
    </div>
    
  );
};

export default CustomerDashboard;