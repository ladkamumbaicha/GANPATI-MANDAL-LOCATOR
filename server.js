const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'daksh799@';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || '';

// ========== MONGOOSE SETUP ==========
const mandalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, default: '' },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  email: { type: String, default: '' },
  area: { type: String, default: '' },
  image_url: { type: String, default: '' },
  morning_arti: { type: String, default: '' },
  afternoon_arti: { type: String, default: '' },
  evening_arti: { type: String, default: '' },
  description: { type: String, default: '' },
  established_year: { type: String, default: '' },
  quote: { type: String, default: '' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Mandal = mongoose.model('Mandal', mandalSchema);

// ========== SEED DEFAULT DATA ==========
async function seedDefaultData() {
  try {
    const count = await Mandal.countDocuments();
    if (count === 0) {
      console.log('No mandals found, seeding default data...');
      const defaults = [
        { name: 'Lalbaugcha Raja', address: 'Lalbaug, Mumbai', latitude: 19.0176, longitude: 72.8479, email: 'lalbaug@mandal.com', area: 'Central Mumbai', image_url: 'https://images.unsplash.com/photo-1585687572407-1d1e4e61f5e3?w=500&h=350&fit=crop', morning_arti: '06:30 AM', afternoon_arti: '01:30 PM', evening_arti: '08:00 PM', description: 'One of the most famous Ganpati pandals in Mumbai.', established_year: '1934', quote: 'Lalbaugcha Raja Sarkar!' },
        { name: 'Ganesh Mandal', address: 'Girgaum, Mumbai', latitude: 18.9520, longitude: 72.8289, email: 'ganesh@mandal.com', area: 'South Mumbai', image_url: 'https://images.unsplash.com/photo-1599058917212-d217368e6651?w=500&h=350&fit=crop', morning_arti: '06:00 AM', afternoon_arti: '02:00 PM', evening_arti: '07:30 PM', description: 'A historic mandal serving the Girgaum community.', established_year: '1920' },
        { name: 'Andhericha Raja', address: 'Andheri, Mumbai', latitude: 19.1136, longitude: 72.8697, email: 'andheri@mandal.com', area: 'North Mumbai', image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL7ASrWHEVzGxJY_9p5yYXqFQJIvjFllV2WQ&s', morning_arti: '07:00 AM', afternoon_arti: '02:30 PM', evening_arti: '07:00 PM', description: 'The beloved Raja of Andheri.', established_year: '1966' },
        { name: 'Ganesh Galli Mandal', address: 'Lalbaug, Mumbai', latitude: 19.0185, longitude: 72.8465, email: 'ganeshgalli@mandal.com', area: 'Central Mumbai', image_url: 'https://images.unsplash.com/photo-1588519119230-80ffe68ec159?w=500&h=350&fit=crop', morning_arti: '06:00 AM', afternoon_arti: '01:00 PM', evening_arti: '08:30 PM', description: 'Famous for its creative themes each year.', established_year: '1948' }
      ];
      await Mandal.insertMany(defaults);
      console.log('✓ Default mandals seeded successfully');
    } else {
      console.log('✓ Found', count, 'existing mandals in database');
    }
  } catch (err) {
    console.error('Error seeding data:', err.message);
  }
}

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json());

// Clean URL redirects - remove .html extensions from URLs
app.get('/index.html', (req, res) => {
  res.redirect(301, '/');
});

// Serve admin.html when visiting /admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Redirect /admin.html to /admin (clean URL)
app.get('/admin.html', (req, res) => {
  res.redirect(301, '/admin');
});

// Serve static files from the root directory
const staticPath = __dirname;
console.log('Static path:', staticPath);
console.log('✓ Using MongoDB for persistent database');
app.use(express.static(staticPath));

// ========== LOGIN ENDPOINT ==========
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    res.json({ error: 'Password required' });
    return;
  }

  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid admin password' });
  }
});

// ========== API ROUTES ==========

// Get all mandals
app.get('/api/mandals', async (req, res) => {
  try {
    const mandals = await Mandal.find().sort({ name: 1 }).lean();
    const result = mandals.map(m => ({ id: m._id.toString(), name: m.name, address: m.address, latitude: m.latitude, longitude: m.longitude, email: m.email, area: m.area, image_url: m.image_url, morning_arti: m.morning_arti, afternoon_arti: m.afternoon_arti, evening_arti: m.evening_arti, description: m.description, established_year: m.established_year, quote: m.quote }));
    res.json(result);
  } catch (err) {
    console.error('Error fetching mandals:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Search mandals
app.get('/api/mandals/search', async (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  try {
    const mandals = await Mandal.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } },
        { area: { $regex: query, $options: 'i' } }
      ]
    }).limit(50).sort({ name: 1 }).lean();
    const result = mandals.map(m => ({ id: m._id.toString(), name: m.name, address: m.address, latitude: m.latitude, longitude: m.longitude, email: m.email, area: m.area, image_url: m.image_url, morning_arti: m.morning_arti, afternoon_arti: m.afternoon_arti, evening_arti: m.evening_arti, description: m.description, established_year: m.established_year, quote: m.quote }));
    res.json(result);
  } catch (err) {
    console.error('Error searching mandals:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get single mandal
app.get('/api/mandals/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const m = await Mandal.findById(id).lean();
    if (!m) {
      res.status(404).json({ error: 'Mandal not found' });
      return;
    }
    res.json({ id: m._id.toString(), name: m.name, address: m.address, latitude: m.latitude, longitude: m.longitude, email: m.email, area: m.area, image_url: m.image_url, morning_arti: m.morning_arti, afternoon_arti: m.afternoon_arti, evening_arti: m.evening_arti, description: m.description, established_year: m.established_year, quote: m.quote });
  } catch (err) {
    console.error('Error fetching mandal:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add new mandal (admin)
app.post('/api/mandals', async (req, res) => {
  const { password, name, address, latitude, longitude, email, area, image_url, morning_arti, afternoon_arti, evening_arti, description, established_year, quote } = req.body;

  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid admin password' });
    return;
  }

  if (!name || latitude === undefined || longitude === undefined) {
    res.status(400).json({ error: 'Name, latitude, and longitude are required' });
    return;
  }

  try {
    const mandal = new Mandal({
      name, address, latitude: parseFloat(latitude), longitude: parseFloat(longitude),
      email: email || '', area: area || '',
      image_url: image_url || '', morning_arti: morning_arti || '',
      afternoon_arti: afternoon_arti || '', evening_arti: evening_arti || '',
      description: description || '', established_year: established_year || '',
      quote: quote || ''
    });
    const saved = await mandal.save();
    res.json({ success: true, id: saved._id.toString(), message: 'Mandal added successfully' });
  } catch (err) {
    console.error('Error adding mandal:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update mandal (admin)
app.put('/api/mandals/:id', async (req, res) => {
  const { password, name, address, latitude, longitude, email, area, image_url, morning_arti, afternoon_arti, evening_arti, description, established_year, quote } = req.body;
  const { id } = req.params;

  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid admin password' });
    return;
  }

  try {
    const mandal = await Mandal.findById(id);
    if (!mandal) {
      res.status(404).json({ error: 'Mandal not found' });
      return;
    }

    if (name) mandal.name = name;
    if (address !== undefined) mandal.address = address;
    if (latitude !== undefined) mandal.latitude = parseFloat(latitude);
    if (longitude !== undefined) mandal.longitude = parseFloat(longitude);
    if (email !== undefined) mandal.email = email;
    if (area !== undefined) mandal.area = area;
    if (image_url !== undefined) mandal.image_url = image_url;
    if (morning_arti !== undefined) mandal.morning_arti = morning_arti;
    if (afternoon_arti !== undefined) mandal.afternoon_arti = afternoon_arti;
    if (evening_arti !== undefined) mandal.evening_arti = evening_arti;
    if (description !== undefined) mandal.description = description;
    if (established_year !== undefined) mandal.established_year = established_year;
    if (quote !== undefined) mandal.quote = quote;
    mandal.updated_at = new Date();

    await mandal.save();
    res.json({ success: true, message: 'Mandal updated successfully' });
  } catch (err) {
    console.error('Error updating mandal:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Delete mandal (admin)
app.delete('/api/mandals/:id', async (req, res) => {
  const { password } = req.body;
  const { id } = req.params;

  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid admin password' });
    return;
  }

  try {
    const mandal = await Mandal.findByIdAndDelete(id);
    if (!mandal) {
      res.status(404).json({ error: 'Mandal not found' });
      return;
    }
    res.json({ success: true, message: 'Mandal deleted successfully' });
  } catch (err) {
    console.error('Error deleting mandal:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ========== EXPORT for serverless platforms ==========
module.exports = app;

// ========== START SERVER (for local dev) ==========
if (require.main === module) {
  async function start() {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('✓ Connected to MongoDB Atlas');
      await seedDefaultData();
      app.listen(PORT, () => {
        console.log(`✓ Server running on http://localhost:${PORT}`);
        console.log(`✓ Admin Panel at http://localhost:${PORT}/admin`);
      });
    } catch (err) {
      console.error('✗ Failed to start server:', err.message);
      console.log('✗ Make sure MONGODB_URI environment variable is set');
      process.exit(1);
    }
  }
  start();
}