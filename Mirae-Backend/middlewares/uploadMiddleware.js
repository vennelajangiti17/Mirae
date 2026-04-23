const fs = require('fs');
const path = require('path');
const multer = require('multer');

const profileUploadDir = path.join(__dirname, '..', 'uploads', 'profile');

fs.mkdirSync(profileUploadDir, { recursive: true });

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

module.exports = { uploadProfilePhoto };
