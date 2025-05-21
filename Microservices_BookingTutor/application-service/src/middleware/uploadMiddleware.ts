
import multer from 'multer';

// Cấu hình multer để lưu file tạm vào memory
const storage = multer.memoryStorage();

// Middleware upload
export const uploadMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận file hình ảnh
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file hình ảnh'));
    }
  },
});

// Sử dụng middleware này trong route
export const handleImageUpload = uploadMiddleware.array('images', 5);