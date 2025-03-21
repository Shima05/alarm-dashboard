import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { __dirname } from '../utils/utils.ts';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, uniqueName);
  },
});

// Configure multer middleware
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png'];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error('Only JPEG and PNG files are allowed.'));
    } else {
      cb(null, true);
    }
  },
});

// Promise-based file upload handler
export const handleFileUploads = (req: Request): Promise<string[] | null> => {
  return new Promise((resolve, reject) => {
    upload.array('files', 10)(req, {} as Response, (err) => {
      if (err) {
        return reject(new Error(`Upload error: ${err.message}`));
      }

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return resolve(null); // No files uploaded
      }

      const filePaths = files.map((file) => `/uploads/${file.filename}`);
      resolve(filePaths);
    });
  });
};
