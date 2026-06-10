import multer from 'multer';

// Use memoryStorage to stream files directly to Cloudinary without writing temp files to disk
const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // Limit files to 10MB
    }
});
