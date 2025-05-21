import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Cấu hình thư mục lưu trữ
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Chỉ hỗ trợ file ảnh (jpeg, jpg, png, gif)'));
  },
});

// Interface cho response
interface UploadResponse {
  result: {
    files: {
      file: Array<{
        name: string;
        originalName: string;
        size: number;
        type: string;
      }>;
    };
  };
}

// Controller cho upload ảnh
const uploadImage = (req: Request, res: Response) => {
  try {
    if (!req.file) {
       res.status(400).json({ error: 'Không có file được gửi lên' });return
    }

    const file = {
      name: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
    };

    const response: UploadResponse = {
      result: {
        files: {
          file: [file],
        },
      },
    };

    res.status(200).json(response);
  } catch (err: any) {
    console.error('Lỗi khi upload ảnh:', err);
    res.status(500).json({ error: 'Lỗi server khi upload ảnh' });
  }
};

// Controller cho download ảnh
const downloadImage = (req: Request, res: Response) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDir, filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Lỗi khi gửi file:', err);
        res.status(500).json({ error: 'Lỗi khi tải file' });
      }
    });
  } else {
    res.status(404).json({ error: 'File không tồn tại' });
  }
};

export { uploadImage, downloadImage, upload };