const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'daksh799@';

// MongoDB connection (keep your connection string here or set MONGODB_URI env var in Vercel)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dakshbudhel123_db_user:daksh799@ganpatimandallocator.y08xg3g.mongodb.net/mandal-darshan?retryWrites=true&w=majority&appName=Ganpatimandallocator';

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
  instagram: { type: String, default: '' },
  facebook: { type: String, default: '' },
  twitter: { type: String, default: '' },
  youtube: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  telegram: { type: String, default: '' },
  website: { type: String, default: '' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Mandal = mongoose.model('Mandal', mandalSchema);

// ========== FALLBACK IN-MEMORY DATABASE ==========
let useInMemory = false;
let inMemoryMandals = [];
let nextId = 1;

function toResponse(m) {
  return {
    id: m._id ? m._id.toString() : String(m._localId || m.id),
    name: m.name,
    address: m.address,
    latitude: m.latitude,
    longitude: m.longitude,
    email: m.email,
    area: m.area,
    image_url: m.image_url,
    morning_arti: m.morning_arti,
    afternoon_arti: m.afternoon_arti,
    evening_arti: m.evening_arti,
    description: m.description,
    established_year: m.established_year,
    quote: m.quote,
    instagram: m.instagram,
    facebook: m.facebook,
    twitter: m.twitter,
    youtube: m.youtube,
    whatsapp: m.whatsapp,
    telegram: m.telegram,
    website: m.website
  };
}

// ========== SEED DEFAULT DATA ==========
async function seedDefaultData() {
  if (useInMemory) {
    if (inMemoryMandals.length === 0) {
      console.log('No mandals found, seeding default data...');
      const defaults = [
        { name: 'Lalbaugcha Raja', address: 'Lalbaug, Mumbai', latitude: 19.0176, longitude: 72.8479, email: 'lalbaug@mandal.com', area: 'Central Mumbai', image_url: 'https://images.unsplash.com/photo-1585687572407-1d1e4e61f5e3?w=500&h=350&fit=crop', morning_arti: '06:30 AM', afternoon_arti: '01:30 PM', evening_arti: '08:00 PM', description: 'One of the most famous Ganpati pandals in Mumbai.', established_year: '1934', quote: 'Lalbaugcha Raja Sarkar!',
        instagram: '', facebook: '', twitter: '', youtube: '', whatsapp: '', telegram: '', website: '' },
        { name: 'Ganesh Mandal', address: 'Girgaum, Mumbai', latitude: 18.9520, longitude: 72.8289, email: 'ganesh@mandal.com', area: 'South Mumbai', image_url: 'https://images.unsplash.com/photo-1599058917212-d217368e6651?w=500&h=350&fit=crop', morning_arti: '06:00 AM', afternoon_arti: '02:00 PM', evening_arti: '07:30 PM', description: 'A historic mandal serving the Girgaum community.', established_year: '1920',
        instagram: '', facebook: '', twitter: '', youtube: '', whatsapp: '', telegram: '', website: '' },
        { name: 'Andhericha Raja', address: 'Andheri, Mumbai', latitude: 19.1136, longitude: 72.8697, email: 'andheri@mandal.com', area: 'North Mumbai', image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL7ASrWHEVzGxJY_9p5yYXqFQJIvjFllV2WQ&s', morning_arti: '07:00 AM', afternoon_arti: '02:30 PM', evening_arti: '07:00 PM', description: 'The beloved Raja of Andheri.', established_year: '1966',
        instagram: '', facebook: '', twitter: '', youtube: '', whatsapp: '', telegram: '', website: '' },
        { name: 'Ganesh Galli Mandal', address: 'Lalbaug, Mumbai', latitude: 19.0185, longitude: 72.8465, email: 'ganeshgalli@mandal.com', area: 'Central Mumbai', image_url: 'https://images.unsplash.com/photo-1588519119230-80ffe68ec159?w=500&h=350&fit=crop', morning_arti: '06:00 AM', afternoon_arti: '01:00 PM', evening_arti: '08:30 PM', description: 'Famous for its creative themes each year.', established_year: '1948',
        instagram: '', facebook: '', twitter: '', youtube: '', whatsapp: '', telegram: '', website: ''
      ];

      inMemoryMandals = defaults.map(d => ({ ...d, _localId: nextId++ }));
      console.log('✓ Default mandals seeded successfully (in-memory)');
    } else {
      console.log('✓ Found', inMemoryMandals.length, 'existing mandals (in-memory)');
    }
    return;
  }

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

// ========== SEO & ROBOTS/SITEMAP ==========
// Serve sitemap.xml with proper content type
app.get('/sitemap.xml', (req, res) => {
  res.set('Content-Type', 'application/xml');
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

// Serve robots.txt with proper content type
app.get('/robots.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

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

// ========== FILE UPLOAD SETUP ==========
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'mandal-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, WebP, GIF)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Serve uploads folder statically
app.use('/uploads', express.static(uploadsDir));

// Serve static files from the root directory
const staticPath = __dirname;
console.log('Static path:', staticPath);
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

// ========== IN-MEMORY HELPERS ==========
function findInMemory(id) {
  return inMemoryMandals.find(m => (m._id ? m._id.toString() : String(m._localId)) === id);
}

// ========== API ROUTES ==========

// Get all mandals
app.get('/api/mandals', async (req, res) => {
  try {
    if (useInMemory) {
      const result = inMemoryMandals.map(toResponse).sort((a, b) => a.name.localeCompare(b.name));
      return res.json(result);
    }
    const mandals = await Mandal.find().sort({ name: 1 }).lean();
    const result = mandals.map(m => toResponse(m));
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
    if (useInMemory) {
      const result = inMemoryMandals
        .filter(m => (m.name || '').toLowerCase().includes(query) || (m.address || '').toLowerCase().includes(query) || (m.area || '').toLowerCase().includes(query))
        .slice(0, 50)
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        .map(toResponse);
      return res.json(result);
    }
    const mandals = await Mandal.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } },
        { area: { $regex: query, $options: 'i' } }
      ]
    }).limit(50).sort({ name: 1 }).lean();
    const result = mandals.map(m => toResponse(m));
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
    let m;
    if (useInMemory) {
      m = findInMemory(id);
      if (!m) return res.status(404).json({ error: 'Mandal not found' });
      return res.json(toResponse(m));
    }
    m = await Mandal.findById(id).lean();
    if (!m) {
      res.status(404).json({ error: 'Mandal not found' });
      return;
    }
    res.json(toResponse(m));
  } catch (err) {
    console.error('Error fetching mandal:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Upload image (admin)
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }
  const imageUrl = '/uploads/' + req.file.filename;
  res.json({ success: true, image_url: imageUrl });
});

// Add new mandal (admin)
app.post('/api/mandals', async (req, res) => {
  const { password, name, address, latitude, longitude, email, area, image_url, morning_arti, afternoon_arti, evening_arti, description, established_year, quote, instagram, facebook, twitter, youtube, whatsapp, telegram, website } = req.body;

  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid admin password' });
    return;
  }

  if (!name || latitude === undefined || longitude === undefined) {
    res.status(400).json({ error: 'Name, latitude, and longitude are required' });
    return;
  }

  try {
    if (useInMemory) {
      const newMandal = {
        _localId: nextId++,
        name,
        address: address || '',
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        email: email || '',
        area: area || '',
        image_url: image_url || '',
        morning_arti: morning_arti || '',
        afternoon_arti: afternoon_arti || '',
        evening_arti: evening_arti || '',
        description: description || '',
        established_year: established_year || '',
        quote: quote || '',
        instagram: instagram || '',
        facebook: facebook || '',
        twitter: twitter || '',
        youtube: youtube || '',
        whatsapp: whatsapp || '',
        telegram: telegram || '',
        website: website || ''
      };
      inMemoryMandals.push(newMandal);
      return res.json({ success: true, id: String(newMandal._localId), message: 'Mandal added successfully' });
    }

    const mandal = new Mandal({
      name, address, latitude: parseFloat(latitude), longitude: parseFloat(longitude),
      email: email || '', area: area || '',
      image_url: image_url || '', morning_arti: morning_arti || '',
      afternoon_arti: afternoon_arti || '', evening_arti: evening_arti || '',
      description: description || '', established_year: established_year || '',
      quote: quote || '',
        instagram: instagram || '',
        facebook: facebook || '',
        twitter: twitter || '',
        youtube: youtube || '',
        whatsapp: whatsapp || '',
        telegram: telegram || '',
        website: website || ''
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
  const { password, name, address, latitude, longitude, email, area, image_url, morning_arti, afternoon_arti, evening_arti, description, established_year, quote, instagram, facebook, twitter, youtube, whatsapp, telegram, website } = req.body;
  const { id } = req.params;

  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid admin password' });
    return;
  }

  try {
    if (useInMemory) {
      const m = findInMemory(id);
      if (!m) return res.status(404).json({ error: 'Mandal not found' });
      if (name) m.name = name;
      if (address !== undefined) m.address = address;
      if (latitude !== undefined) m.latitude = parseFloat(latitude);
      if (longitude !== undefined) m.longitude = parseFloat(longitude);
      if (email !== undefined) m.email = email;
      if (area !== undefined) m.area = area;
      if (image_url !== undefined) m.image_url = image_url;
      if (morning_arti !== undefined) m.morning_arti = morning_arti;
      if (afternoon_arti !== undefined) m.afternoon_arti = afternoon_arti;
      if (evening_arti !== undefined) m.evening_arti = evening_arti;
      if (description !== undefined) m.description = description;
      if (established_year !== undefined) m.established_year = established_year;
      if (quote !== undefined) m.quote = quote;
      if (instagram !== undefined) m.instagram = instagram;
      if (facebook !== undefined) m.facebook = facebook;
      if (twitter !== undefined) m.twitter = twitter;
      if (youtube !== undefined) m.youtube = youtube;
      if (whatsapp !== undefined) m.whatsapp = whatsapp;
      if (telegram !== undefined) m.telegram = telegram;
      if (website !== undefined) m.website = website;
      return res.json({ success: true, message: 'Mandal updated successfully' });
    }

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
    if (instagram !== undefined) mandal.instagram = instagram;
    if (facebook !== undefined) mandal.facebook = facebook;
    if (twitter !== undefined) mandal.twitter = twitter;
    if (youtube !== undefined) mandal.youtube = youtube;
    if (whatsapp !== undefined) mandal.whatsapp = whatsapp;
    if (telegram !== undefined) mandal.telegram = telegram;
    if (website !== undefined) mandal.website = website;
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
    if (useInMemory) {
      const idx = inMemoryMandals.findIndex(m => (m._id ? m._id.toString() : String(m._localId)) === id);
      if (idx === -1) return res.status(404).json({ error: 'Mandal not found' });
      inMemoryMandals.splice(idx, 1);
      return res.json({ success: true, message: 'Mandal deleted successfully' });
    }
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


// ========== PUBLIC PAGE FALLBACK ROUTES ==========
// Fixes direct URL access for pages like /mandals on Render.
// Keep this AFTER all /api routes so API requests are not caught by the website fallback.
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();

  // Do not interfere with API, uploads, sitemap, robots, or real static asset files.
  if (
    req.path.startsWith('/api/') ||
    req.path.startsWith('/uploads/') ||
    req.path === '/sitemap.xml' ||
    req.path === '/robots.txt' ||
    path.extname(req.path)
  ) {
    return next();
  }

  // If a matching clean HTML file exists, serve it.
  // Example: /mandals -> mandals.html
  const cleanPath = req.path.replace(/^\/+/, '') || 'index';
  const matchingHtmlFile = path.join(__dirname, `${cleanPath}.html`);
  if (fs.existsSync(matchingHtmlFile)) {
    return res.sendFile(matchingHtmlFile);
  }

  // Otherwise send index.html so React / client-side routes work on refresh/direct open.
  const indexFile = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexFile)) {
    return res.sendFile(indexFile);
  }

  return next();
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
      console.error('✗ MongoDB connection failed:', err.message);
      console.log('⚠ Falling back to in-memory database (data will not persist)');
      useInMemory = true;
      await seedDefaultData();
      app.listen(PORT, () => {
        console.log(`✓ Server running on http://localhost:${PORT} (in-memory mode)`);
        console.log(`✓ Admin Panel at http://localhost:${PORT}/admin`);
      });
    }
  }
  start();
}
