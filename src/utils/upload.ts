export const imageFilter = (
  req: any,
  file: Express.Multer.File,
  cb: any
): any => {
  // Aceita apenas arquivos com as extensões jpg, jpeg, png, ou gif
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    req.fileValidationError = 'Somente imagens são permitidas!';

    return cb(new Error('Somente imagens são permitidas!'), false);
  }

  cb(null, true);
};
