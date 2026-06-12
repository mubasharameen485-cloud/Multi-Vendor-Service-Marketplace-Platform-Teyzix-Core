import React, { useState, useEffect, useContext } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ProviderProfileForm = ({ onSuccess }) => {
  const { user } = useContext(AuthContext);
  const { register, control, handleSubmit, setValue, reset } = useForm({
    defaultValues: { portfolio: [{ title: '', link: '' }] }
  });
  
  // React Hook Form ka useFieldArray dynamic portfolio items ke liye
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'portfolio'
  });

  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  // Pehle se bani hui profile fetch karna
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/provider/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success && response.data.data) {
          const profile = response.data.data;
          setProfileData(profile);
          
          // Form ko purane data se fill karna
          setValue('experience', profile.experience);
          setValue('pricing', profile.pricing);
          setValue('skills', Array.isArray(profile.skills) ? profile.skills.join(', ') : '');
          if (profile.portfolio && profile.portfolio.length > 0) {
            setValue('portfolio', profile.portfolio);
          }
        }
      } catch (error) {
        console.log("No existing profile found. You can create a new one.");
      }
    };
    fetchProfile();
  }, [setValue]);

  const onSubmit = async (data) => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    if (data.profilePic && data.profilePic[0]) {
      formData.append('profilePic', data.profilePic[0]);
    }

    const skillsArray = data.skills.split(',').map(s => s.trim()).filter(s => s);
    formData.append('skills', JSON.stringify(skillsArray));
    formData.append('experience', data.experience);
    formData.append('pricing', data.pricing);
    formData.append('portfolio', JSON.stringify(data.portfolio));

    const response = await axios.post('http://localhost:5000/api/provider/profile', formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.success) {
      alert('✅ Profile saved successfully!');
      // Error se bachne ke liye pehle check karein ke prop mojud hai
      if (onSuccess) {
        onSuccess(); 
      }
    }
  } catch (error) {
    console.error("DEBUG ERROR:", error); // Console mein check karein error kya hai
    // Agar success alert aa gaya hai tou error alert na dikhayein
    if (!loading) return; 
    alert(error.response?.data?.message || 'Error updating profile');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-white p-6 rounded shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Manage Your Profile</h2>
      
      {profileData?.profilePicture && (
        <div className="mb-4">
          <img 
            src={profileData.profilePicture} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover border-2 border-green-500 shadow"
          />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-medium mb-1">Profile Picture</label>
          <input 
            type="file" 
            accept="image/*"
            {...register('profilePic')} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium mb-1">Skills (Comma separated)</label>
          <input 
            type="text" 
            placeholder="e.g. React, Node.js, Graphic Design"
            {...register('skills', { required: 'Skills are required' })} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Experience & Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Experience</label>
            <input 
              type="text" 
              placeholder="e.g. 3 Years in Web Dev"
              {...register('experience')} 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Base Pricing ($/hr)</label>
            <input 
              type="number" 
              placeholder="e.g. 20"
              {...register('pricing')} 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Portfolio Items - Dynamic Array */}
        <div className="border p-4 rounded bg-gray-50">
          <label className="block text-sm font-semibold mb-2">Portfolio Projects</label>
          {fields.map((item, index) => (
            <div key={item.id} className="flex gap-2 mb-2 items-center">
              <input 
                type="text" 
                placeholder="Project Title"
                {...register(`portfolio.${index}.title`, { required: true })} 
                className="w-1/2 border p-2 rounded text-sm"
              />
              <input 
                type="text" 
                placeholder="Project Link (Optional)"
                {...register(`portfolio.${index}.link`)} 
                className="w-1/2 border p-2 rounded text-sm"
              />
              <button 
                type="button" 
                onClick={() => remove(index)} 
                className="text-red-500 font-bold px-2 hover:text-red-700"
              >
                X
              </button>
            </div>
          ))}
          <button 
            type="button" 
            onClick={() => append({ title: '', link: '' })} 
            className="text-sm text-green-600 font-medium hover:underline mt-2"
          >
            + Add Another Project
          </button>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full text-white p-2 rounded transition font-medium ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {loading ? 'Saving Profile...' : 'Save Profile'}
        </button>

      </form>
    </div>
  );
};

export default ProviderProfileForm;