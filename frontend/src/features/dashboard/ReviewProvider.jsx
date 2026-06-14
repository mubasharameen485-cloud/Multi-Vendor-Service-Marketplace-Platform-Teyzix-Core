import React, { useState } from 'react';
import axios from 'axios';

const ReviewProvider = ({ providerId, providerName, onClose }) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/reviews', {
        providerId,
        rating,
        feedback
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Review submitted successfully!');
      onClose(); // Modal close
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Rate {providerName}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Rating (1-5)</label>
            <select 
              value={rating} 
              onChange={(e) => setRating(Number(e.target.value))} 
              className="w-full p-2 border rounded focus:ring-green-500"
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
              <option value={4}>⭐⭐⭐⭐ (4 - Good)</option>
              <option value={3}>⭐⭐⭐ (3 - Average)</option>
              <option value={2}>⭐⭐ (2 - Poor)</option>
              <option value={1}>⭐ (1 - Terrible)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Your Feedback</label>
            <textarea 
              required 
              rows="3" 
              placeholder="How was your experience?" 
              value={feedback} 
              onChange={(e) => setFeedback(e.target.value)} 
              className="w-full p-2 border rounded focus:ring-green-500"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="w-1/2 bg-gray-200 text-gray-800 py-2 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="w-1/2 bg-green-600 text-white py-2 rounded">
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewProvider;