import multer from 'multer';
import { v4 } from 'uuid';
import { extname, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const usaCloudinary = Boolean(process.env.CLOUDINARY_URL);

// Em producao o disco e efemero (Render, Railway): o arquivo vai para a
// memoria e de la sobe para o Cloudinary. Em desenvolvimento, sem
// CLOUDINARY_URL, continua gravando em uploads/.
export default {
  storage: usaCloudinary
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'uploads'),
        filename: (request, file, callback) => {
          return callback(null, v4() + extname(file.originalname));
        },
      }),
  limits: { fileSize: 5 * 1024 * 1024 },
};
