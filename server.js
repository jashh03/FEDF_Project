import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_me';

app.use(cors());
app.use(express.json());

// ---------- In-Memory Data ----------
let users = [];
let doctors = [
  // ----- Cardiologist (9 doctors) -----
  { id:1, name:'Sarah Johnson', specialty:'Cardiologist', location:'Mumbai, MH', working_start:'09:00', working_end:'17:00', slot_duration:30, email:'sarah.j@heartcare.com', phone:'+91 22 5550 0101', fee:1800, rating:4.8 },
  { id:2, name:'Rajesh Khanna', specialty:'Cardiologist', location:'Delhi, DL', working_start:'10:00', working_end:'18:00', slot_duration:30, email:'rajesh.k@heartclinic.com', phone:'+91 11 5550 0102', fee:2000, rating:4.9 },
  { id:3, name:'Priya Mehta', specialty:'Cardiologist', location:'Bengaluru, KA', working_start:'08:30', working_end:'16:30', slot_duration:30, email:'priya.m@cardiohealth.com', phone:'+91 80 5550 0103', fee:1900, rating:4.7 },
  { id:4, name:'Anil Sharma', specialty:'Cardiologist', location:'Chennai, TN', working_start:'09:00', working_end:'17:00', slot_duration:30, email:'anil.s@heartinstitute.com', phone:'+91 44 5550 0104', fee:1750, rating:4.6 },
  { id:5, name:'Deepa Nair', specialty:'Cardiologist', location:'Kolkata, WB', working_start:'08:00', working_end:'16:00', slot_duration:30, email:'deepa.n@cardioassist.com', phone:'+91 33 5550 0105', fee:1850, rating:4.9 },
  { id:6, name:'Vikram Singh', specialty:'Cardiologist', location:'Hyderabad, TS', working_start:'09:30', working_end:'17:30', slot_duration:30, email:'vikram.s@heartcare.com', phone:'+91 40 5550 0106', fee:2100, rating:4.8 },
  { id:7, name:'Kavita Joshi', specialty:'Cardiologist', location:'Pune, MH', working_start:'10:00', working_end:'18:00', slot_duration:30, email:'kavita.j@cardiospecialist.com', phone:'+91 20 5550 0107', fee:1700, rating:4.7 },
  { id:8, name:'Ramesh Iyer', specialty:'Cardiologist', location:'Ahmedabad, GJ', working_start:'09:00', working_end:'17:00', slot_duration:30, email:'ramesh.i@heartcare.com', phone:'+91 79 5550 0108', fee:1600, rating:4.8 },
  { id:9, name:'Swati Desai', specialty:'Cardiologist', location:'Jaipur, RJ', working_start:'08:30', working_end:'16:30', slot_duration:30, email:'swati.d@cardiohealth.com', phone:'+91 141 5550 0109', fee:1650, rating:4.6 },

  // ----- Dermatologist (9 doctors) -----
  { id:10, name:'Michael Chen', specialty:'Dermatologist', location:'Mumbai, MH', working_start:'10:00', working_end:'18:00', slot_duration:30, email:'michael.c@skinclinic.com', phone:'+91 22 5550 0110', fee:1500, rating:4.9 },
  { id:11, name:'Neha Gupta', specialty:'Dermatologist', location:'Delhi, DL', working_start:'09:00', working_end:'17:00', slot_duration:30, email:'neha.g@dermacare.com', phone:'+91 11 5550 0111', fee:1400, rating:4.8 },
  { id:12, name:'Arjun Reddy', specialty:'Dermatologist', location:'Bengaluru, KA', working_start:'08:30', working_end:'16:30', slot_duration:30, email:'arjun.r@skinscience.com', phone:'+91 80 5550 0112', fee:1600, rating:4.7 },
  { id:13, name:'Sneha Patil', specialty:'Dermatologist', location:'Chennai, TN', working_start:'09:30', working_end:'17:30', slot_duration:30, email:'sneha.p@dermaclinic.com', phone:'+91 44 5550 0113', fee:1450, rating:4.8 },
  { id:14, name:'Rahul Verma', specialty:'Dermatologist', location:'Kolkata, WB', working_start:'10:00', working_end:'18:00', slot_duration:30, email:'rahul.v@skinhealth.com', phone:'+91 33 5550 0114', fee:1550, rating:4.6 },
  { id:15, name:'Pooja Jain', specialty:'Dermatologist', location:'Hyderabad, TS', working_start:'09:00', working_end:'17:00', slot_duration:30, email:'pooja.j@dermaworld.com', phone:'+91 40 5550 0115', fee:1700, rating:4.9 },
  { id:16, name:'Kunal Saxena', specialty:'Dermatologist', location:'Pune, MH', working_start:'08:00', working_end:'16:00', slot_duration:30, email:'kunal.s@skincareindia.com', phone:'+91 20 5550 0116', fee:1350, rating:4.7 },
  { id:17, name:'Anjali Bansal', specialty:'Dermatologist', location:'Ahmedabad, GJ', working_start:'09:30', working_end:'17:30', slot_duration:30, email:'anjali.b@dermacare.com', phone:'+91 79 5550 0117', fee:1480, rating:4.8 },
  { id:18, name:'Rohan Kapoor', specialty:'Dermatologist', location:'Jaipur, RJ', working_start:'10:00', working_end:'18:00', slot_duration:30, email:'rohan.k@skinsolutions.com', phone:'+91 141 5550 0118', fee:1380, rating:4.6 },

  // ----- General Physician (9 doctors) -----
  { id:19, name:'James Wilson', specialty:'General Physician', location:'Mumbai, MH', working_start:'09:00', working_end:'17:00', slot_duration:30, email:'james.w@familycare.com', phone:'+91 22 5550 0119', fee:1200, rating:4.6 },
  { id:20, name:'Sonia Sharma', specialty:'General Physician', location:'Delhi, DL', working_start:'08:30', working_end:'16:30', slot_duration:30, email:'sonia.s@primarycare.com', phone:'+91 11 5550 0120', fee:1100, rating:4.8 },
  { id:21, name:'Vikrant Singh', specialty:'General Physician', location:'Bengaluru, KA', working_start:'09:00', working_end:'17:00', slot_duration:30, email:'vikrant.s@clinicindia.com', phone:'+91 80 5550 0121', fee:1250, rating:4.7 },
  { id:22, name:'Lakshmi Raman', specialty:'General Physician', location:'Chennai, TN', working_start:'10:00', working_end:'18:00', slot_duration:30, email:'lakshmi.r@familymed.com', phone:'+91 44 5550 0122', fee:1150, rating:4.5 },
  { id:23, name:'Amitabh Bose', specialty:'General Physician', location:'Kolkata, WB', working_start:'08:00', working_end:'16:00', slot_duration:30, email:'amitabh.b@wellnessclinic.com', phone:'+91 33 5550 0123', fee:1080, rating:4.7 },
  { id:24, name:'Kiran Deshmukh', specialty:'General Physician', location:'Hyderabad, TS', working_start:'09:30', working_end:'17:30', slot_duration:30, email:'kiran.d@healthfirst.com', phone:'+91 40 5550 0124', fee:1300, rating:4.9 },
  { id:25, name:'Meena Goyal', specialty:'General Physician', location:'Pune, MH', working_start:'09:00', working_end:'17:00', slot_duration:30, email:'meena.g@clinicare.com', phone:'+91 20 5550 0125', fee:1180, rating:4.6 },
  { id:26, name:'Prakash Nayak', specialty:'General Physician', location:'Ahmedabad, GJ', working_start:'08:30', working_end:'16:30', slot_duration:30, email:'prakash.n@medicenter.com', phone:'+91 79 5550 0126', fee:1050, rating:4.7 },
  { id:27, name:'Shilpa Shetty', specialty:'General Physician', location:'Jaipur, RJ', working_start:'10:00', working_end:'18:00', slot_duration:30, email:'shilpa.s@jhankarclinic.com', phone:'+91 141 5550 0127', fee:1120, rating:4.8 },

  // ----- Pediatrician (9 doctors) -----
  { id:28, name:'Priya Sharma', specialty:'Pediatrician', location:'Mumbai, MH', working_start:'09:30', working_end:'15:30', slot_duration:30, email:'priya.s@kidsfirst.com', phone:'+91 22 5550 0128', fee:1800, rating:4.9 },
  { id:29, name:'Sunil Gupta', specialty:'Pediatrician', location:'Delhi, DL', working_start:'10:00', working_end:'18:00', slot_duration:30, email:'sunil.g@childcare.com', phone:'+91 11 5550 0129', fee:1700, rating:4.8 },
  { id:30, name:'Anita Menon', specialty:'Pediatrician', location:'Bengaluru, KA', working_start:'08:30', working_end:'16:30', slot_duration:30, email:'anita.m@kidshealth.com', phone:'+91 80 5550 0130', fee:1900, rating:4.7 },
  { id:31, name:'Girish Kumar', specialty:'Pediatrician', location:'Chennai, TN', working_start:'09:00', working_end:'17:00', slot_duration:30, email:'girish.k@pediacare.com', phone:'+91 44 5550 0131', fee:1750, rating:4.8 },
  { id:32, name:'Ritika Das', specialty:'Pediatrician', location:'Kolkata, WB', working_start:'08:00', working_end:'16:00', slot_duration:30, email:'ritika.d@littlehearts.com', phone:'+91 33 5550 0132', fee:1600, rating:4.9 },
  { id:33, name:'Suresh Reddy', specialty:'Pediatrician', location:'Hyderabad, TS', working_start:'09:30', working_end:'17:30', slot_duration:30, email:'suresh.r@childspecialist.com', phone:'+91 40 5550 0133', fee:1850, rating:4.6 },
  { id:34, name:'Kavita Mishra', specialty:'Pediatrician', location:'Pune, MH', working_start:'10:00', working_end:'18:00', slot_duration:30, email:'kavita.m@kidsclinic.com', phone:'+91 20 5550 0134', fee:1650, rating:4.7 },
  { id:35, name:'Alok Shah', specialty:'Pediatrician', location:'Ahmedabad, GJ', working_start:'09:00', working_end:'17:00', slot_duration:30, email:'alok.s@pediatricare.com', phone:'+91 79 5550 0135', fee:1550, rating:4.8 },
  { id:36, name:'Neelam Verma', specialty:'Pediatrician', location:'Jaipur, RJ', working_start:'08:30', working_end:'16:30', slot_duration:30, email:'neelam.v@babycare.com', phone:'+91 141 5550 0136', fee:1500, rating:4.6 },

  // ----- Neurologist (8 doctors) -----
  { id:37, name:'Emily Rodriguez', specialty:'Neurologist', location:'Mumbai, MH', working_start:'08:30', working_end:'16:30', slot_duration:30, email:'emily.r@neurocare.com', phone:'+91 22 5550 0137', fee:2500, rating:4.7 },
  { id:38, name:'Rajiv Malhotra', specialty:'Neurologist', location:'Delhi, DL', working_start:'09:00', working_end:'17:00', slot_duration:30, email:'rajiv.m@brainhealth.com', phone:'+91 11 5550 0138', fee:2600, rating:4.8 },
  { id:39, name:'Shalini Gupta', specialty:'Neurologist', location:'Bengaluru, KA', working_start:'10:00', working_end:'18:00', slot_duration:30, email:'shalini.g@neuroclinic.com', phone:'+91 80 5550 0139', fee:2400, rating:4.6 },
  { id:40, name:'Karthik Rajan', specialty:'Neurologist', location:'Chennai, TN', working_start:'08:00', working_end:'16:00', slot_duration:30, email:'karthik.r@neurologist.com', phone:'+91 44 5550 0140', fee:2300, rating:4.9 },
  { id:41, name:'Moushumi Das', specialty:'Neurologist', location:'Kolkata, WB', working_start:'09:30', working_end:'17:30', slot_duration:30, email:'moushumi.d@neurocare.com', phone:'+91 33 5550 0141', fee:2200, rating:4.7 },
  { id:42, name:'Sandeep Reddy', specialty:'Neurologist', location:'Hyderabad, TS', working_start:'10:00', working_end:'18:00', slot_duration:30, email:'sandeep.r@brainclinic.com', phone:'+91 40 5550 0142', fee:2700, rating:4.8 },
  { id:43, name:'Anuradha Kulkarni', specialty:'Neurologist', location:'Pune, MH', working_start:'09:00', working_end:'17:00', slot_duration:30, email:'anuradha.k@neurospecialist.com', phone:'+91 20 5550 0143', fee:2450, rating:4.6 },
  { id:44, name:'Vijay Shekhawat', specialty:'Neurologist', location:'Jaipur, RJ', working_start:'08:30', working_end:'16:30', slot_duration:30, email:'vijay.s@brainhealth.com', phone:'+91 141 5550 0144', fee:2350, rating:4.7 },

  // ----- Orthopedic Surgeon (9 doctors) -----
  { id:45, name:'David Kim', specialty:'Orthopedic Surgeon', location:'Mumbai, MH', working_start:'08:00', working_end:'16:00', slot_duration:30, email:'david.k@bonehealth.com', phone:'+91 22 5550 0145', fee:2800, rating:4.8 },
  { id:46, name:'Ajay Thakur', specialty:'Orthopedic Surgeon', location:'Delhi, DL', working_start:'09:30', working_end:'17:30', slot_duration:30, email:'ajay.t@orthocare.com', phone:'+91 11 5550 0146', fee:2700, rating:4.9 },
  { id:47, name:'Nina Pillai', specialty:'Orthopedic Surgeon', location:'Bengaluru, KA', working_start:'08:00', working_end:'16:00', slot_duration:30, email:'nina.p@jointclinic.com', phone:'+91 80 5550 0147', fee:2600, rating:4.7 },
  { id:48, name:'Manoj Kumar', specialty:'Orthopedic Surgeon', location:'Chennai, TN', working_start:'10:00', working_end:'18:00', slot_duration:30, email:'manoj.k@orthohealth.com', phone:'+91 44 5550 0148', fee:2900, rating:4.6 },
  { id:49, name:'Soumya Chakraborty', specialty:'Orthopedic Surgeon', location:'Kolkata, WB', working_start:'09:00', working_end:'17:00', slot_duration:30, email:'soumya.c@bonecare.com', phone:'+91 33 5550 0149', fee:2500, rating:4.8 },
  { id:50, name:'Ravi Shankar', specialty:'Orthopedic Surgeon', location:'Hyderabad, TS', working_start:'08:30', working_end:'16:30', slot_duration:30, email:'ravi.s@orthospecialist.com', phone:'+91 40 5550 0150', fee:3000, rating:4.9 },
  { id:51, name:'Pallavi Joshi', specialty:'Orthopedic Surgeon', location:'Pune, MH', working_start:'09:00', working_end:'17:00', slot_duration:30, email:'pallavi.j@jointcare.com', phone:'+91 20 5550 0151', fee:2650, rating:4.7 },
  { id:52, name:'Harish Mehta', specialty:'Orthopedic Surgeon', location:'Ahmedabad, GJ', working_start:'10:00', working_end:'18:00', slot_duration:30, email:'harish.m@orthoclinic.com', phone:'+91 79 5550 0152', fee:2550, rating:4.8 },
  { id:53, name:'Geeta Singh', specialty:'Orthopedic Surgeon', location:'Jaipur, RJ', working_start:'08:00', working_end:'16:00', slot_duration:30, email:'geeta.s@boneclinic.com', phone:'+91 141 5550 0153', fee:2750, rating:4.6 },

  // ----- ENT Specialist (9 doctors) -----
  { id:54, name:'Jessica Turner', specialty:'ENT Specialist', location:'Mumbai, MH', working_start:'08:30', working_end:'16:30', slot_duration:30, email:'jessica.t@earsnose.com', phone:'+91 22 5550 0154', fee:1800, rating:4.8 },
  { id:55, name:'Sanjay Mishra', specialty:'ENT Specialist', location:'Delhi, DL', working_start:'09:00', working_end:'17:00', slot_duration:30, email:'sanjay.m@entcare.com', phone:'+91 11 5550 0155', fee:1900, rating:4.7 },
  { id:56, name:'Anjali Nair', specialty:'ENT Specialist', location:'Bengaluru, KA', working_start:'10:00', working_end:'18:00', slot_duration:30, email:'anjali.n@entclinic.com', phone:'+91 80 5550 0156', fee:1700, rating:4.9 },
  { id:57, name:'Ramesh Krishnan', specialty:'ENT Specialist', location:'Chennai, TN', working_start:'08:00', working_end:'16:00', slot_duration:30, email:'ramesh.k@enthealth.com', phone:'+91 44 5550 0157', fee:1600, rating:4.6 },
  { id:58, name:'Debjani Roy', specialty:'ENT Specialist', location:'Kolkata, WB', working_start:'09:30', working_end:'17:30', slot_duration:30, email:'debjani.r@entspecialist.com', phone:'+91 33 5550 0158', fee:1750, rating:4.8 },
  { id:59, name:'Pratap Reddy', specialty:'ENT Specialist', location:'Hyderabad, TS', working_start:'10:00', working_end:'18:00', slot_duration:30, email:'pratap.r@entindia.com', phone:'+91 40 5550 0159', fee:2000, rating:4.7 },
  { id:60, name:'Swati Phadke', specialty:'ENT Specialist', location:'Pune, MH', working_start:'09:00', working_end:'17:00', slot_duration:30, email:'swati.p@entclinic.com', phone:'+91 20 5550 0160', fee:1650, rating:4.8 },
  { id:61, name:'Ketan Shah', specialty:'ENT Specialist', location:'Ahmedabad, GJ', working_start:'08:30', working_end:'16:30', slot_duration:30, email:'ketan.s@earsnosecare.com', phone:'+91 79 5550 0161', fee:1550, rating:4.6 },
  { id:62, name:'Neeraj Saxena', specialty:'ENT Specialist', location:'Jaipur, RJ', working_start:'09:30', working_end:'17:30', slot_duration:30, email:'neeraj.s@entwellness.com', phone:'+91 141 5550 0162', fee:1850, rating:4.9 }

];
let appointments = [];

const getNextId = (arr) => arr.length ? Math.max(...arr.map(i=>i.id)) + 1 : 1;

// Seed admin (admin@example.com / admin123)
const adminHash = bcrypt.hashSync('admin123', 10);
users.push({ id:1, name:'Admin', email:'admin@example.com', password:adminHash, role:'admin', medical_history:null, created_at:new Date().toISOString() });
// Seed test patient (patient@example.com / patient123)
const patientHash = bcrypt.hashSync('patient123', 10);
users.push({ id:2, name:'John Doe', email:'patient@example.com', password:patientHash, role:'patient', medical_history:'Allergic to penicillin', created_at:new Date().toISOString() });

// ---------- Middleware ----------
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

const requireRole = (roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Access denied' });
  next();
};

// ---------- Auth Routes ----------
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, medical_history } = req.body;
    if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const newUser = { id: getNextId(users), name, email, password: hashed, role: 'patient', medical_history: medical_history || null, created_at: new Date().toISOString() };
    users.push(newUser);
    const token = jwt.sign({ id: newUser.id, email, role: 'patient', name }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'Registration successful', token, user: { id: newUser.id, name, email, role: 'patient' } });
  } catch (error) { res.status(500).json({ error: 'Registration failed' }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email, role: user.role } });
  } catch (error) { res.status(500).json({ error: 'Login failed' }); }
});

app.get('/api/auth/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role, medical_history: user.medical_history });
});

app.put('/api/auth/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.name = req.body.name || user.name;
  user.medical_history = req.body.medical_history || user.medical_history;
  res.json({ message: 'Profile updated successfully' });
});

// ---------- Doctor Routes ----------
app.get('/api/doctors', (req, res) => {
  let { specialty, location, search } = req.query;
  let filtered = [...doctors];
  if (specialty) filtered = filtered.filter(d => d.specialty.toLowerCase().includes(specialty.toLowerCase()));
  if (location) filtered = filtered.filter(d => d.location.toLowerCase().includes(location.toLowerCase()));
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(d => d.name.toLowerCase().includes(s) || d.specialty.toLowerCase().includes(s) || d.location.toLowerCase().includes(s));
  }
  res.json(filtered);
});

app.get('/api/doctors/specialties', (req, res) => {
  res.json([...new Set(doctors.map(d => d.specialty))]);
});

app.get('/api/doctors/available-slots', authenticateToken, (req, res) => {
  const { doctorId, date } = req.query;
  const doctor = doctors.find(d => d.id === parseInt(doctorId));
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
  const selected = new Date(date);
  const today = new Date(); today.setHours(0,0,0,0);
  if (selected < today) return res.json([]);
  const slots = [];
  let start = new Date(`${date}T${doctor.working_start}`);
  const end = new Date(`${date}T${doctor.working_end}`);
  const booked = appointments.filter(a => a.doctor_id === doctor.id && a.status === 'scheduled' && new Date(a.appointment_time).toDateString() === selected.toDateString())
    .map(a => new Date(a.appointment_time).getTime());
  while (start < end) {
    const slotTime = new Date(start);
    if (!booked.includes(slotTime.getTime()) && slotTime > new Date()) {
      slots.push({ time: slotTime.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' }), datetime: slotTime.toISOString() });
    }
    start = new Date(start.getTime() + doctor.slot_duration * 60000);
  }
  res.json(slots);
});

app.get('/api/doctors/:id', (req, res) => {
  const doctor = doctors.find(d => d.id === parseInt(req.params.id));
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
  res.json(doctor);
});

// ---------- Appointment Routes ----------
app.post('/api/appointments/book', authenticateToken, (req, res) => {
  const { doctor_id, appointment_time, reason } = req.body;
  const patient_id = req.user.id;
  if (appointments.find(a => a.doctor_id === doctor_id && a.appointment_time === appointment_time && a.status === 'scheduled')) {
    return res.status(409).json({ error: 'Time slot already booked' });
  }
  const doctor = doctors.find(d => d.id === doctor_id);
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
  const aptDate = new Date(appointment_time);
  const start = new Date(`${aptDate.toDateString()} ${doctor.working_start}`);
  const end = new Date(`${aptDate.toDateString()} ${doctor.working_end}`);
  if (aptDate < start || aptDate >= end) return res.status(400).json({ error: 'Outside working hours' });
  const newAppointment = {
    id: getNextId(appointments),
    patient_id,
    doctor_id,
    appointment_time,
    status: 'scheduled',
    reminder_sent: false,
    reason: reason || 'General consultation',
    created_at: new Date().toISOString(),
  };
  appointments.push(newAppointment);
  const patient = users.find(u => u.id === patient_id);
  res.status(201).json({
    message: 'Appointment booked',
    appointment: { ...newAppointment, doctor_name: doctor.name, patient_name: patient.name, specialty: doctor.specialty, fee: doctor.fee, location: doctor.location }
  });
});

app.get('/api/appointments/my-appointments', authenticateToken, (req, res) => {
  const userApps = appointments.filter(a => a.patient_id === req.user.id).map(a => {
    const d = doctors.find(doc => doc.id === a.doctor_id);
    return { ...a, doctor_name: d.name, specialty: d.specialty, fee: d.fee, location: d.location };
  }).sort((a,b) => new Date(b.appointment_time) - new Date(a.appointment_time));
  res.json(userApps);
});

app.put('/api/appointments/:id/cancel', authenticateToken, (req, res) => {
  const apt = appointments.find(a => a.id === parseInt(req.params.id) && a.patient_id === req.user.id);
  if (!apt) return res.status(404).json({ error: 'Appointment not found' });
  apt.status = 'cancelled';
  res.json({ message: 'Appointment cancelled successfully' });
});

app.put('/api/appointments/:id/reschedule', authenticateToken, (req, res) => {
  const { new_time } = req.body;
  const apt = appointments.find(a => a.id === parseInt(req.params.id) && a.patient_id === req.user.id && a.status === 'scheduled');
  if (!apt) return res.status(404).json({ error: 'Appointment not found or already cancelled' });
  const conflict = appointments.find(a => a.doctor_id === apt.doctor_id && a.appointment_time === new_time && a.status === 'scheduled' && a.id !== apt.id);
  if (conflict) return res.status(409).json({ error: 'New time slot already booked' });
  apt.appointment_time = new_time;
  res.json({ message: 'Appointment rescheduled successfully' });
});

// ---------- Reminder Routes ----------
app.post('/api/reminders/send', authenticateToken, (req, res) => {
  const { appointment_id } = req.body;
  const apt = appointments.find(a => a.id === appointment_id && a.patient_id === req.user.id);
  if (!apt) return res.status(404).json({ error: 'Appointment not found' });
  const doctor = doctors.find(d => d.id === apt.doctor_id);
  const patient = users.find(u => u.id === apt.patient_id);
  if (!doctor || !patient) return res.status(404).json({ error: 'Data missing' });
  const aptDate = new Date(apt.appointment_time);
  console.log(`📧 MOCK EMAIL to ${patient.email}: Appointment Reminder - Dear ${patient.name}, your appointment with Dr. ${doctor.name} is on ${aptDate.toLocaleDateString()} at ${aptDate.toLocaleTimeString()}.`);
  apt.reminder_sent = true;
  res.json({ message: 'Reminder sent (mock)' });
});

app.get('/api/reminders/upcoming', authenticateToken, (req, res) => {
  const upcoming = appointments
    .filter(a => a.patient_id === req.user.id && a.status === 'scheduled' && new Date(a.appointment_time) > new Date())
    .slice(0, 5);
  res.json(upcoming);
});

// ---------- Admin Routes ----------
app.get('/api/admin/doctors', authenticateToken, requireRole(['admin']), (req, res) => res.json(doctors));
app.post('/api/admin/doctors', authenticateToken, requireRole(['admin']), (req, res) => {
  const { name, specialty, location, working_start, working_end, slot_duration, email, phone, fee } = req.body;
  const newDoctor = { id: getNextId(doctors), name, specialty, location, working_start, working_end, slot_duration: slot_duration || 30, email, phone, fee: parseFloat(fee), rating: 0 };
  doctors.push(newDoctor);
  res.status(201).json(newDoctor);
});
app.put('/api/admin/doctors/:id', authenticateToken, requireRole(['admin']), (req, res) => {
  const id = parseInt(req.params.id);
  const index = doctors.findIndex(d => d.id === id);
  if (index === -1) return res.status(404).json({ error: 'Doctor not found' });
  doctors[index] = { ...doctors[index], ...req.body };
  res.json({ message: 'Doctor updated' });
});
app.delete('/api/admin/doctors/:id', authenticateToken, requireRole(['admin']), (req, res) => {
  const id = parseInt(req.params.id);
  const index = doctors.findIndex(d => d.id === id);
  if (index === -1) return res.status(404).json({ error: 'Doctor not found' });
  doctors.splice(index, 1);
  res.json({ message: 'Doctor deleted' });
});
app.get('/api/admin/appointments', authenticateToken, requireRole(['admin']), (req, res) => {
  const all = appointments.map(apt => {
    const doctor = doctors.find(d => d.id === apt.doctor_id);
    const patient = users.find(u => u.id === apt.patient_id);
    return { ...apt, doctor_name: doctor?.name, patient_name: patient?.name };
  });
  res.json(all);
});
app.get('/api/admin/patients', authenticateToken, requireRole(['admin']), (req, res) => {
  const patients = users.filter(u => u.role === 'patient').map(({ password, ...rest }) => rest);
  res.json(patients);
});

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));