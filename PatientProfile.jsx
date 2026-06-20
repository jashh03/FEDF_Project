import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const PatientProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '', medical_history: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try { const res = await axios.get('/api/auth/profile'); setProfile(res.data); } catch (error) { toast.error('Failed to load profile'); } finally { setLoading(false); }
  };
  const handleUpdate = async () => {
    try { await axios.put('/api/auth/profile', { name: profile.name, medical_history: profile.medical_history }); toast.success('Profile updated'); setIsEditing(false); } catch (error) { toast.error('Update failed'); }
  };
  if (loading) return <div className="text-center py-12">Loading...</div>;
  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in max-w-2xl">
      <div className="glass-card p-8">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-3xl font-bold gradient-text">My Profile</h1>
          {!isEditing && <button onClick={() => setIsEditing(true)} className="btn-secondary">✏️ Edit Profile</button>}
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            {isEditing ? <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="input-field" /> : <p className="text-lg font-medium">{profile.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-lg">{profile.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
            {isEditing ? <textarea value={profile.medical_history || ''} onChange={(e) => setProfile({...profile, medical_history: e.target.value})} className="input-field" rows="5" /> : <p className="text-gray-600 bg-gray-50 p-3 rounded-xl">{profile.medical_history || 'Not provided'}</p>}
          </div>
          {isEditing && <div className="flex gap-3 pt-4"><button onClick={handleUpdate} className="btn-primary">Save Changes</button><button onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button></div>}
        </div>
      </div>
    </div>
  );
};
export default PatientProfile;