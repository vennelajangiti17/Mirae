const fs = require('fs');
const path = require('path');
const multer = require('multer');

const profileUploadDir = path.join(__dirname, '..', 'uploads', 'profile');
const resumeUploadDir = path.join(__dirname, '..', 'uploads', 'resumes');

fs.mkdirSync(profileUploadDir, { recursive: true });
fs.mkdirSync(resumeUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, profileUploadDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname || '').toLowerCase();
    const safeExtension = extension || '.jpg';
    cb(null, `profile-${req.user.id}-${Date.now()}${safeExtension}`);
  }
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith('image/')) {
    cb(null, true);
    return;
  }

  cb(new Error('Only image uploads are allowed.'));
};

const uploadProfilePhoto = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

const resumeStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, resumeUploadDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname || '').toLowerCase();
    const safeExtension = extension || '.txt';
    cb(null, `resume-${req.user.id}-${Date.now()}${safeExtension}`);
  }
});

const resumeFileFilter = (_req, file, cb) => {
  const allowedMimeTypes = new Set([
    'application/pdf',
    'text/plain',
    'text/markdown',
    'application/octet-stream'
  ]);
  const extension = path.extname(file.originalname || '').toLowerCase();
  const allowedExtensions = new Set(['.pdf', '.txt', '.md']);

  if (allowedMimeTypes.has(file.mimetype) || allowedExtensions.has(extension)) {
    cb(null, true);
    return;
  }

  cb(new Error('Only PDF, TXT, or MD resume uploads are allowed.'));
};

const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: resumeFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = { uploadProfilePhoto, uploadResume, resumeUploadDir };
