import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const CustomerProfileForm = ({ user, onSuccess }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name }
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.profilePic[0]) formData.append('profilePic', data.profilePic[0]);

      
      await axios.post('http://localhost:5000/api/auth/update-profile', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      alert("Profile Updated!");
      onSuccess();
    } catch (err) { alert("Update failed"); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow border space-y-4">
      <h3 className="font-bold text-lg">Edit Personal Info</h3>
      <input {...register('name')} className="w-full p-2 border rounded" placeholder="Your Name" />
      <input type="file" {...register('profilePic')} className="w-full p-2 border rounded" />
      <button className="w-full bg-blue-600 text-white py-2 rounded font-bold">
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default CustomerProfileForm;