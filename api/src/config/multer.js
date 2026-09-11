import multer from 'multer';
import { v4 } from 'uuid';
import { extname, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// So consideramos o Cloudinary configurado se a URL tiver o formato correto.
// Um valor malformado (ex: colado junto com "CLOUDINARY_URL=") fazia o SDK
// lancar no import e derrubava a API inteira, inclusive rotas sem imagem.
const cloudinaryUrl = process.env.CLOUDINARY_URL;

export const usaCloudinary = Boolean(
  cloudinaryUrl && cloudinaryUrl.startsWith('cloudinary://'),
);

if (cloudinaryUrl && !usaCloudinary) {
  console.error(
    'CLOUDINARY_URL ignorada: o valor precisa comecar com "cloudinary://". ' +
      'As imagens serao gravadas em disco.',
  );
}

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
