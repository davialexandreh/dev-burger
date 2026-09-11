import { v2 as cloudinary } from 'cloudinary';

import { usaCloudinary } from '../../config/multer.js';

// Sobe o arquivo que o multer deixou em memoria e devolve a URL definitiva
// em request.file.filename, que e o campo que os controllers ja gravam.
// Sem CLOUDINARY_URL o arquivo ja foi para o disco e nada muda.
export default function uploadImage(request, response, next) {
  if (!usaCloudinary || !request.file || !request.file.buffer) {
    return next();
  }

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'devburger' },
    (error, resultado) => {
      if (error) {
        return next(error);
      }

      request.file.filename = resultado.secure_url;

      return next();
    },
  );

  stream.end(request.file.buffer);
}
