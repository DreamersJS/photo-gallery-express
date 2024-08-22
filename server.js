const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('photo');

// Check File Type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

// API route to get list of images
app.get('/api/images', (req, res) => {
  fs.readdir('./public/uploads/', (err, files) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Unable to scan directory' });
    } else {
      res.json({ images: files });
    }
  });
});

// Upload Photo Route
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      if (req.file == undefined) {
        res.status(400).json({ error: 'No File Selected!' });
      } else {
        res.redirect('/');
      }
    }
  });
});

// Delete Photo Route
app.post('/delete', (req, res) => {
  const filepath = path.join(__dirname, 'public', 'uploads', req.body.filename);

    // Check if filename is undefined
    if (!req.body.filename) {
        return res.status(400).json({ error: 'No filename provided' });
      }

  fs.unlink(filepath, (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Unable to delete file' });
    } else {
      res.redirect('/');
    }
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
