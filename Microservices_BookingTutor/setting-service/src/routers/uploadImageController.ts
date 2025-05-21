import { Router } from 'express';
import { uploadImage, downloadImage, upload } from '../controllers/uploadImageController';

const uploadImageRoute = Router();

// Route upload ảnh
uploadImageRoute.post('/upload', upload.single('file'), uploadImage);

// Route download ảnh
uploadImageRoute.get('/download/:filename', downloadImage);

export default uploadImageRoute;