import multer from 'multer';

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// File filter for PDFs only
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Create multer upload instance for resume (PDF only)
export const uploadResume = multer({ 
  storage,
  fileFilter: pdfFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Create multer upload instance for any file type (for portfolio/documents)
export const uploadDocument = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});
