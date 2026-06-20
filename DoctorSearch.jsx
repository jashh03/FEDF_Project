import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const DoctorSearch = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', specialty: '', location: '' });
  const navigate = useNavigate();

  useEffect(() => { fetchSpecialties(); fetchDoctors(); }, []);
  useEffect(() => { fetchDoctors(); }, [filters]);

  const fetchSpecialties = async () => {
    try { const res = await axios.get('/api/doctors/specialties'); setSpecialties(res.data); } catch (error) { console.error(error); }
  };
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.specialty) params.append('specialty', filters.specialty);
      if (filters.location) params.append('location', filters.location);
      const res = await axios.get(`/api/doctors?${params}`);
      setDoctors(res.data);
    } catch (error) { toast.error('Failed to fetch doctors'); } finally { setLoading(false); }
  };
  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const handleBookClick = (id) => navigate(`/doctor/${id}`);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold gradient-text mb-2">Find Your Doctor</h1>
        <p className="text-gray-600">Search by name, specialty, or location</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🔍 Search</label>
            <input type="text" placeholder="Name, specialty, location..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🏷️ Specialty</label>
            <select value={filters.specialty} onChange={(e) => handleFilterChange('specialty', e.target.value)} className="input-field">
              <option value="">All Specialties</option>
              {specialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">📍 Location</label>
            <input type="text" placeholder="City, State" value={filters.location} onChange={(e) => handleFilterChange('location', e.target.value)} className="input-field" />
          </div>
        </div>
      </div>

      {/* Doctor Cards */}
      {loading ? (
        <div className="text-center py-12">Loading doctors...</div>
      ) : doctors.length === 0 ? (
        <div className="glass-card text-center py-12 text-gray-500">No doctors found matching your criteria</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map(doc => (
            <div key={doc.id} className="glass-card p-6 card-hover cursor-pointer" onClick={() => handleBookClick(doc.id)}>
              <div className="flex justify-between items-start mb-3">
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full p-2">
                  <span className="text-2xl">👨‍⚕️</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <span>⭐</span> {doc.rating}
                </div>
              </div>
              <h3 className="text-xl font-semibold">Dr. {doc.name}</h3>
              <p className="text-blue-600 font-medium mt-1">{doc.specialty}</p>
              <p className="text-gray-600 text-sm mt-2">📍 {doc.location}</p>
              <p className="text-gray-600 text-sm">⏰ {doc.working_start} - {doc.working_end}</p>
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                <span className="text-xl font-bold text-blue-600">₹{doc.fee}</span>
                <button className="btn-primary text-sm px-4 py-1.5">Book →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default DoctorSearch;