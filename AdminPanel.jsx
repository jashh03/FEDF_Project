import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [activeTab, setActiveTab] = useState('doctors');
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name:'', specialty:'', location:'', working_start:'09:00', working_end:'17:00', fee:'', email:'', phone:'' });

  useEffect(() => { fetchDoctors(); fetchAppointments(); fetchPatients(); }, []);

  const fetchDoctors = async () => { try { const res = await axios.get('/api/admin/doctors'); setDoctors(res.data); } catch (error) { toast.error('Failed to fetch doctors'); } };
  const fetchAppointments = async () => { try { const res = await axios.get('/api/admin/appointments'); setAppointments(res.data); } catch (error) { toast.error('Failed to fetch appointments'); } };
  const fetchPatients = async () => { try { const res = await axios.get('/api/admin/patients'); setPatients(res.data); } catch (error) { toast.error('Failed to fetch patients'); } };
  const handleAddDoctor = async () => {
    try { await axios.post('/api/admin/doctors', newDoctor); toast.success('Doctor added'); setShowAddDoctor(false); setNewDoctor({ name:'', specialty:'', location:'', working_start:'09:00', working_end:'17:00', fee:'', email:'', phone:'' }); fetchDoctors(); } catch (error) { toast.error('Failed to add doctor'); }
  };
  const handleDeleteDoctor = async (id) => {
    if (window.confirm('Delete this doctor?')) { try { await axios.delete(`/api/admin/doctors/${id}`); toast.success('Deleted'); fetchDoctors(); } catch (error) { toast.error('Failed'); } }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-center gradient-text mb-8">Admin Dashboard</h1>
      <div className="border-b border-gray-200 mb-8 flex justify-center gap-2">
        {['doctors','appointments','patients'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 font-semibold rounded-t-xl transition-all ${activeTab===tab ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}`}>
            {tab.charAt(0).toUpperCase()+tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'doctors' && (
        <div>
          <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-semibold">Manage Doctors</h2><button onClick={() => setShowAddDoctor(!showAddDoctor)} className="btn-primary">{showAddDoctor ? 'Cancel' : '+ Add Doctor'}</button></div>
          {showAddDoctor && <div className="glass-card p-6 mb-6"><h3 className="text-xl font-semibold mb-4">Add New Doctor</h3><div className="grid md:grid-cols-2 gap-4"><input type="text" placeholder="Name" value={newDoctor.name} onChange={e=>setNewDoctor({...newDoctor,name:e.target.value})} className="input-field"/><input type="text" placeholder="Specialty" value={newDoctor.specialty} onChange={e=>setNewDoctor({...newDoctor,specialty:e.target.value})} className="input-field"/><input type="text" placeholder="Location" value={newDoctor.location} onChange={e=>setNewDoctor({...newDoctor,location:e.target.value})} className="input-field"/><input type="time" value={newDoctor.working_start} onChange={e=>setNewDoctor({...newDoctor,working_start:e.target.value})} className="input-field"/><input type="time" value={newDoctor.working_end} onChange={e=>setNewDoctor({...newDoctor,working_end:e.target.value})} className="input-field"/><input type="number" placeholder="Fee ($)" value={newDoctor.fee} onChange={e=>setNewDoctor({...newDoctor,fee:e.target.value})} className="input-field"/><input type="email" placeholder="Email" value={newDoctor.email} onChange={e=>setNewDoctor({...newDoctor,email:e.target.value})} className="input-field"/><input type="tel" placeholder="Phone" value={newDoctor.phone} onChange={e=>setNewDoctor({...newDoctor,phone:e.target.value})} className="input-field"/></div><button onClick={handleAddDoctor} className="btn-primary mt-4">Save Doctor</button></div>}
          <div className="grid gap-4">{doctors.map(doc => <div key={doc.id} className="glass-card p-5 flex justify-between items-center flex-wrap gap-4"><div><h3 className="font-bold text-lg">Dr. {doc.name}</h3><p className="text-gray-600">{doc.specialty}</p><p className="text-gray-600">{doc.location}</p><p className="text-blue-600 font-bold">₹{doc.fee}</p></div><button onClick={()=>handleDeleteDoctor(doc.id)} className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition shadow">Delete</button></div>)}</div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div><h2 className="text-2xl font-semibold mb-4">All Appointments</h2><div className="space-y-4">{appointments.map(apt => <div key={apt.id} className="glass-card p-5"><div className="flex justify-between flex-wrap gap-4"><div><p className="font-semibold">Patient: {apt.patient_name}</p><p>Doctor: Dr. {apt.doctor_name}</p><p>{new Date(apt.appointment_time).toLocaleString()}</p><p>Status: {apt.status}</p></div><span className={`px-3 py-1 rounded-full text-xs font-semibold ${apt.status==='scheduled'?'bg-green-100 text-green-800':apt.status==='cancelled'?'bg-red-100 text-red-800':'bg-gray-100'}`}>{apt.status}</span></div></div>)}</div></div>
      )}

      {activeTab === 'patients' && (
        <div><h2 className="text-2xl font-semibold mb-4">Registered Patients</h2><div className="grid gap-4">{patients.map(p => <div key={p.id} className="glass-card p-5"><h3 className="font-bold text-lg">{p.name}</h3><p className="text-gray-600">📧 {p.email}</p><p className="text-gray-600">📋 Medical History: {p.medical_history || 'None'}</p><p className="text-gray-600 text-sm">📅 Registered: {new Date(p.created_at).toLocaleDateString()}</p></div>)}</div></div>
      )}
    </div>
  );
};
export default AdminPanel;