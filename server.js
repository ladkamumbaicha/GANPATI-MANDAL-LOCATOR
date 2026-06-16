const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'daksh799@';

// ========== MONGODB ATLAS CONNECTION ==========
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://dakshbudhel123_db_user:aqxgHbFQM1VNw90s@ganpatimandallocator.y08xg3g.mongodb.net/mandal-darshan?retryWrites=true&w=majority&appName=Ganpatimandallocator';

let db, mandalsCollection;

async function connectDB() {
  try {
    const client = new MongoClient(MONGO_URI, {
      tls: true,
      tlsAllowInvalidCertificates: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    await client.connect();
    db = client.db('mandal-darshan');
    mandalsCollection = db.collection('mandals');
    console.log('✓ Connected to MongoDB Atlas');
    
    // Ensure indexes
    await mandalsCollection.createIndex({ name: 'text', address: 'text', area: 'text' });
    
    // Check if we have data, if not seed with default mandals
    const count = await mandalsCollection.countDocuments();
    if (count === 0) {
      const defaultMandals = [
        { name: 'Lalbaugcha Raja', address: 'Lalbaug, Mumbai', latitude: 19.0176, longitude: 72.8479, email: 'lalbaug@mandal.com', area: 'Central Mumbai', image_url: 'https://images.unsplash.com/photo-1585687572407-1d1e4e61f5e3?w=500&h=350&fit=crop', morning_arti: '06:30 AM', afternoon_arti: '01:30 PM', evening_arti: '08:00 PM', description: 'One of the most famous Ganpati pandals in Mumbai.', established_year: '1934', quote: 'Lalbaugcha Raja Sarkar!', created_at: new Date().toISOString() },
        { name: 'Ganesh Mandal', address: 'Girgaum, Mumbai', latitude: 18.9520, longitude: 72.8289, email: 'ganesh@mandal.com', area: 'South Mumbai', image_url: 'https://images.unsplash.com/photo-1599058917212-d217368e6651?w=500&h=350&fit=crop', morning_arti: '06:00 AM', afternoon_arti: '02:00 PM', evening_arti: '07:30 PM', description: 'A historic mandal serving the Girgaum community.', established_year: '1920', created_at: new Date().toISOString() },
        { name: 'Andhericha Raja', address: 'Andheri, Mumbai', latitude: 19.1136, longitude: 72.8697, email: 'andheri@mandal.com', area: 'North Mumbai', image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL7ASrWHEVzGxJY_9p5yYXqFQJIvjFllV2WQ&s', morning_arti: '07:00 AM', afternoon_arti: '02:30 PM', evening_arti: '07:00 PM', description: 'The beloved Raja of Andheri.', established_year: '1966', created_at: new Date().toISOString() },
        { name: 'Ganesh Galli Mandal', address: 'Lalbaug, Mumbai', latitude: 19.0185, longitude: 72.8465, email: 'ganeshgalli@mandal.com', area: 'Central Mumbai', image_url: 'https://images.unsplash.com/photo-1588519119230-80ffe68ec159?w=500&h=350&fit=crop', morning_arti: '06:00 AM', afternoon_arti: '01:00 PM', evening_arti: '08:30 PM', description: 'Famous for its creative themes each year.', established_year: '1948', created_at: new Date().toISOString() }
      ];
      await mandalsCollection.insertMany(defaultMandals);
      console.log('✓ Seeded database with 4 default mandals');
    } else {
      console.log(`✓ Database has ${count} existing mandals`);
    }
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

// Connect to MongoDB on startup
connectDB();

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json());

// Serve static files from the root directory
const staticPath = __dirname;
console.log('Static path:', staticPath);
console.log('✓ Using MongoDB Atlas persistent database');
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
    const mandals = await mandalsCollection.find({}).sort({ name: 1 }).toArray();
    const mandalsArray = mandals.map(m => ({
      id: m._id.toString(),
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
      quote: m.quote
    }));
    res.json(mandalsArray);
  } catch (err) {
    console.error('Error fetching mandals:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Search mandals
app.get('/api/mandals/search', async (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  try {
    const mandals = await mandalsCollection.find({}).sort({ name: 1 }).toArray();
    const results = mandals
      .filter(m => {
        const name = (m.name || '').toLowerCase();
        const address = (m.address || '').toLowerCase();
        const area = (m.area || '').toLowerCase();
        return name.includes(query) || address.includes(query) || area.includes(query);
      })
      .slice(0, 50)
      .map(m => ({
        id: m._id.toString(),
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
        quote: m.quote
      }));
    res.json(results);
  } catch (err) {
    console.error('Error searching mandals:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get single mandal
app.get('/api/mandals/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const m = await mandalsCollection.findOne({ _id: new ObjectId(id) });
    if (!m) {
      res.status(404).json({ error: 'Mandal not found' });
      return;
    }
    res.json({
      id: m._id.toString(),
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
      quote: m.quote
    });
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
    const mandal = {
      name, address, latitude: parseFloat(latitude), longitude: parseFloat(longitude),
      email: email || '', area: area || '',
      image_url: image_url || '', morning_arti: morning_arti || '',
      afternoon_arti: afternoon_arti || '', evening_arti: evening_arti || '',
      description: description || '', established_year: established_year || '',
      quote: quote || '', created_at: new Date().toISOString()
    };
    const result = await mandalsCollection.insertOne(mandal);
    res.json({ success: true, id: result.insertedId.toString(), message: 'Mandal added successfully' });
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
    const existing = await mandalsCollection.findOne({ _id: new ObjectId(id) });
    if (!existing) {
      res.status(404).json({ error: 'Mandal not found' });
      return;
    }

    const updateData = {
      name, address, latitude: parseFloat(latitude), longitude: parseFloat(longitude),
      email: email || '', area: area || '',
      image_url: image_url || '', morning_arti: morning_arti || '',
      afternoon_arti: afternoon_arti || '', evening_arti: evening_arti || '',
      description: description || '', established_year: established_year || '',
      quote: quote || '', updated_at: new Date().toISOString()
    };

    await mandalsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
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
    const existing = await mandalsCollection.findOne({ _id: new ObjectId(id) });
    if (!existing) {
      res.status(404).json({ error: 'Mandal not found' });
      return;
    }

    await mandalsCollection.deleteOne({ _id: new ObjectId(id) });
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
  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ Admin Panel at http://localhost:${PORT}/admin.html`);
  });
}
