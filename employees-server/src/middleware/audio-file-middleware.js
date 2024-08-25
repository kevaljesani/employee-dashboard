import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir); // Uploads directory
  },
  filename: function(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  }
});

// Check file type
function checkFileType(file, cb) {
  const allowedMimes = [
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/flac',
    'audio/aac', 'audio/x-ms-wma', 'video/mp4', 'video/x-matroska',
    'video/x-msvideo', 'video/quicktime', 'video/x-ms-wmv', 'video/x-flv'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Error: Audio and Video Files Only!'));
  }
}

// Initialize multer
const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});


export default upload;