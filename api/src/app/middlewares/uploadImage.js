import { usaCloudinary } from '../../config/multer.js';

// O SDK do Cloudinary valida a CLOUDINARY_URL ao ser carregado e lanca se ela
// estiver malformada. Por isso ele so e importado quando a variavel ja foi
// validada, e sob demanda — assim um valor errado nao impede a API de subir.
export default async function uploadImage(request, response, next) {
  if (!usaCloudinary || !request.file || !request.file.buffer) {
    return next();
  }

  try {
    const { v2: cloudinary } = await import('cloudinary');

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
  } catch (err) {
    return next(err);
  }
}
