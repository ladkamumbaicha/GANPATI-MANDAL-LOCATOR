const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'daksh799@';

// ========== FILE-BASED PERSISTENT DATABASE ==========
const DATA_FILE = path.join(__dirname, 'mandals.json');

// Initialize mandals data
let mandalsData = {};
let nextId = 5;

// Load data from file or initialize with default data
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileData = fs.readFileSync(DATA_FILE, 'utf8');
      const parsedData = JSON.parse(fileData);
      mandalsData = parsedData.mandals || {};
      nextId = (parsedData.nextId || 5);
      console.log('✓ Loaded mandals from file:', Object.keys(mandalsData).length, 'mandals');
    } else {
      // Initialize with default mandals on first run
      mandalsData = {
        '1': { name: 'Lalbaugcha Raja', address: 'Lalbaug, Mumbai', latitude: 19.0176, longitude: 72.8479, email: 'lalbaug@mandal.com', area: 'Central Mumbai', image_url: 'https://images.unsplash.com/photo-1585687572407-1d1e4e61f5e3?w=500&h=350&fit=crop', morning_arti: '06:30 AM', afternoon_arti: '01:30 PM', evening_arti: '08:00 PM', description: 'One of the most famous Ganpati pandals in Mumbai.', established_year: '1934', quote: 'Lalbaugcha Raja Sarkar!' },
        '2': { name: 'Ganesh Mandal', address: 'Girgaum, Mumbai', latitude: 18.9520, longitude: 72.8289, email: 'ganesh@mandal.com', area: 'South Mumbai', image_url: 'https://images.unsplash.com/photo-1599058917212-d217368e6651?w=500&h=350&fit=crop', morning_arti: '06:00 AM', afternoon_arti: '02:00 PM', evening_arti: '07:30 PM', description: 'A historic mandal serving the Girgaum community.', established_year: '1920' },
        '3': { name: 'Andhericha Raja', address: 'Andheri, Mumbai', latitude: 19.1136, longitude: 72.8697, email: 'andheri@mandal.com', area: 'North Mumbai', image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL7ASrWHEVzGxJY_9p5yYXqFQJIvjFllV2WQ&s', morning_arti: '07:00 AM', afternoon_arti: '02:30 PM', evening_arti: '07:00 PM', description: 'The beloved Raja of Andheri.', established_year: '1966' },
        '4': { name: 'Ganesh Galli Mandal', address: 'Lalbaug, Mumbai', latitude: 19.0185, longitude: 72.8465, email: 'ganeshgalli@mandal.com', area: 'Central Mumbai', image_url: 'https://images.unsplash.com/photo-1588519119230-80ffe68ec159?w=500&h=350&fit=crop', morning_arti: '06:00 AM', afternoon_arti: '01:00 PM', evening_arti: '08:30 PM', description: 'Famous for its creative themes each year.', established_year: '1948' }
      };
      nextId = 5;
      saveData();
      console.log('✓ Initialized with default mandals');
    }
  } catch (err) {
    console.error('Error loading data:', err.message);
  }
}

// Save data to file
function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ mandals: mandalsData, nextId }, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving data:', err.message);
  }
}

// Load data on startup
loadData();

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
console.log('✓ Using file-based persistent database (mandals.json)');
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
app.get('/api/mandals', (req, res) => {
  try {
    const mandalsArray = Object.entries(mandalsData).map(([id, mandal]) => ({
      id,
      ...mandal
    }));
    mandalsArray.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    res.json(mandalsArray);
  } catch (err) {
    console.error('Error fetching mandals:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Search mandals
app.get('/api/mandals/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  try {
    const results = Object.entries(mandalsData)
      .filter(([id, mandal]) => {
        const name = (mandal.name || '').toLowerCase();
        const address = (mandal.address || '').toLowerCase();
        const area = (mandal.area || '').toLowerCase();
        return name.includes(query) || address.includes(query) || area.includes(query);
      })
      .slice(0, 50)
      .map(([id, mandal]) => ({ id, ...mandal }));
    res.json(results);
  } catch (err) {
    console.error('Error searching mandals:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get single mandal
app.get('/api/mandals/:id', (req, res) => {
  const { id } = req.params;
  try {
    if (!mandalsData[id]) {
      res.status(404).json({ error: 'Mandal not found' });
      return;
    }
    res.json({ id, ...mandalsData[id] });
  } catch (err) {
    console.error('Error fetching mandal:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add new mandal (admin)
app.post('/api/mandals', (req, res) => {
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
    const id = String(nextId++);
    const mandal = {
      name, address, latitude: parseFloat(latitude), longitude: parseFloat(longitude),
      email: email || '', area: area || '',
      image_url: image_url || '', morning_arti: morning_arti || '',
      afternoon_arti: afternoon_arti || '', evening_arti: evening_arti || '',
      description: description || '', established_year: established_year || '',
      quote: quote || '', created_at: new Date().toISOString()
    };
    mandalsData[id] = mandal;
    saveData(); // ← SAVE TO FILE
    res.json({ success: true, id, message: 'Mandal added successfully' });
  } catch (err) {
    console.error('Error adding mandal:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update mandal (admin)
app.put('/api/mandals/:id', (req, res) => {
  const { password, name, address, latitude, longitude, email, area, image_url, morning_arti, afternoon_arti, evening_arti, description, established_year, quote } = req.body;
  const { id } = req.params;

  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid admin password' });
    return;
  }

  try {
    if (!mandalsData[id]) {
      res.status(404).json({ error: 'Mandal not found' });
      return;
    }

    const mandal = {
      name, address, latitude: parseFloat(latitude), longitude: parseFloat(longitude),
      email: email || '', area: area || '',
      image_url: image_url || '', morning_arti: morning_arti || '',
      afternoon_arti: afternoon_arti || '', evening_arti: evening_arti || '',
      description: description || '', established_year: established_year || '',
      quote: quote || '', updated_at: new Date().toISOString()
    };
    mandalsData[id] = { ...mandalsData[id], ...mandal };
    saveData(); // ← SAVE TO FILE
    res.json({ success: true, message: 'Mandal updated successfully' });
  } catch (err) {
    console.error('Error updating mandal:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Delete mandal (admin)
app.delete('/api/mandals/:id', (req, res) => {
  const { password } = req.body;
  const { id } = req.params;

  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid admin password' });
    return;
  }

  try {
    if (!mandalsData[id]) {
      res.status(404).json({ error: 'Mandal not found' });
      return;
    }

    delete mandalsData[id];
    saveData(); // ← SAVE TO FILE
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
    console.log(`✓ Admin Panel at http://localhost:${PORT}/admin`);
  });
}
