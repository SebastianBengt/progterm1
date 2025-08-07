const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Middleware to parse JSON bodies

app.use(express.json());

// File paths
const rocksFile = path.join(__dirname, 'rocks.json');
const imagesDir = path.join(__dirname, 'client/images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

let rocks = [];
if (fs.existsSync(rocksFile)) {
  rocks = JSON.parse(fs.readFileSync(rocksFile));
}

// API routes - define before static middleware!

// GET all rocks
// Unified GET /api/rocks with optional ?search_term
app.get('/api/rocks', (req, res) => {
  const search_term = req.query.search_term ? req.query.search_term.toLowerCase() : '';
  
  const results = search_term
    ? rocks.filter(rock =>
        rock.name.toLowerCase().includes(search_term) ||
        rock.type.toLowerCase().includes(search_term)
      )
    : rocks;

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(results);
});

app.get('/api/rocks/list', (req, res) => {
  const search_term = req.query.search_term ? req.query.search_term.toLowerCase() : '';
  const results = search_term
    ? rocks.filter(rock =>
        rock.name.toLowerCase().includes(search_term) ||
        rock.type.toLowerCase().includes(search_term)
      )
    : rocks;
  // return only id and name for each rock
  const summaries = results.map(({ id, name }) => ({ id, name }));
  res.status(200).json(summaries);
});


app.get('/rock/search', (req, res) => {
  const { search_term } = req.query;

  if (!search_term) {
    return res.status(400).json({ msg: 'Search term is required' });
  }

  const filteredRocks = rocks.filter(rock => {
    return (
      rock.name.toLowerCase().includes(search_term.toLowerCase()) ||
      rock.type.toLowerCase().includes(search_term.toLowerCase())
    );
  });

  res.json(filteredRocks);
});


app.get('/api/rocks/:id', (req, res) => {
  const rock = rocks.find(r => r.id === req.params.id);

  if (!rock) {
    return res.status(404).json({ msg: 'Rock not found' });
  }

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(rock);
});


// POST a new rock (example without image upload, just JSON)
const { v4: uuidv4 } = require('uuid');

app.post('/api/rocks', upload.single('image'), (req, res) => {
  const { name, type, color, grain_size, minerals } = req.body;
  if (!name || !type) {
    return res.status(400).json({ msg: "Name and type are required" });
  }

  // Parse minerals string to array
  let mineralsArray = [];
  if (minerals) {
    mineralsArray = typeof minerals === 'string' 
      ? minerals.split(',').map(s => s.trim())
      : minerals;
  }

  // Set image URL path for frontend
  const image = req.file ? `/images/${req.file.filename}` : null;

  const newRock = {
    id: uuidv4(),
    name,
    type,
    color,
    grain_size,
    minerals: mineralsArray,
    image
  };

  rocks.push(newRock);
  fs.writeFileSync(rocksFile, JSON.stringify(rocks, null, 2));

  res.status(201).json({ msg: "Rock added!", rock: newRock });
});

// Serve static files AFTER API routes
app.use('/images', express.static(imagesDir));
app.use(express.static('client'));


module.exports = app;
