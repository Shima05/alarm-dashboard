import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export const handleFileUploads = (req: Request, res: Response, next: NextFunction): void => {
  upload.array('files', 10)(req, res, (err: any) => {
    if (err) {
      console.error('File upload failed:', err);
      return res.status(400).json({ error: 'File upload failed', details: err.message });
    }
    next();
  });
};
