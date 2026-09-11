import { usaCloudinary } from '../../config/multer.js';

// O SDK do Cloudinary valida a CLOUDINARY_URL ao ser carregado e lanca se ela
// estiver malformada. Por isso ele so e importado quando a variavel ja foi
// validada, e sob demanda — assim um valor errado nao impede a API de subir.
export default async function uploadImage(request, response, next) {
  if (!usaCloudinary || !request.file || !request.file.buffer) {
    return next();
  }

  // Falha no Cloudinary e problema de configuracao, nao bug do servidor: vale
  // devolver a causa em vez de um 500 generico.
  const falhou = (error) => {
    console.error('Falha ao enviar a imagem para o Cloudinary:', error);

    return response.status(502).json({
      error: `Falha ao enviar a imagem para o Cloudinary: ${error.message}`,
    });
  };

  try {
    const { v2: cloudinary } = await import('cloudinary');

    const stream = cloudinary.uploader.upload_stream(
      { folder: 'devburger' },
      (error, resultado) => {
        if (error) {
          return falhou(error);
        }

        request.file.filename = resultado.secure_url;

        return next();
      },
    );

    stream.on('error', falhou);

    stream.end(request.file.buffer);
  } catch (err) {
    return falhou(err);
  }
}
