import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const PORT = 3000;

// __dirname works in CommonJS but not in ES modules
// to make it work in ES modules, we need to use the following code:
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer storage
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('photo');

// Check file type
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


// Parse URL-encoded bodies (from HTML forms)
app.use(express.urlencoded({ extended: true }));

// API route to get list of images
app.get('/api/images', async (req, res) => {
  try {
    const files = await fs.readdir('./public/uploads/');
    res.json({ images: files });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Unable to scan directory' });
  }
});

// Upload photo route
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      if (req.file === undefined) {
        res.status(400).json({ error: 'No File Selected!' });
      } else {
        res.redirect('/');
      }
    }
  });
});

// Delete photo route
app.post('/delete', async (req, res) => {
    const filename = req.body.filename;
    if (!filename) {
      return res.status(400).json({ error: 'No filename provided' });
    }
  
    const filepath = path.join(__dirname, 'public', 'uploads', filename);
  
    try {
      await fs.unlink(filepath);
      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Unable to delete file' });
    }
  });
  

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
