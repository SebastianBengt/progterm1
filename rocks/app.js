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
app.get('/api/rocks', (req, res) => {
  res.json(rocks);
});

app.get('/rock/search', (req, res) => {
  const search_term = req.query.search_term ? req.query.search_term.toLowerCase() : '';
  const results = rocks.filter(rock => 
    rock.name.toLowerCase().includes(search_term) || 
    rock.type.toLowerCase().includes(search_term)
  );
  res.json(results);
});

// POST a new rock (example without image upload, just JSON)
app.post('/api/rocks', upload.single('image'), (req, res) => {
  const { name, type, color, grain_size, minerals } = req.body;

  if (!name || !type) {
    return res.status(400).json({ msg: "Name and type are required" });
  }

  // Image URL that frontend can use to display
  const image = req.file ? `/images/${req.file.filename}` : null;

  const newRock = { name, type, color, grain_size, minerals, image };

  rocks.push(newRock);
  fs.writeFileSync(rocksFile, JSON.stringify(rocks, null, 2));

  res.status(201).json({ msg: "Rock added!", rock: newRock });
});

// Serve static files AFTER API routes
app.use(express.static('client'));

module.exports = app;

