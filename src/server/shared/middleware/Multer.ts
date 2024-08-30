import path from 'path';
import multer from 'multer';

// Configuração do multer para armazenar imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));

    req.body["image"] = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
  },
});

export const upload = multer({ storage: storage });