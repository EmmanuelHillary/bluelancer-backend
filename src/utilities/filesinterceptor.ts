import { NotAcceptableException } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

export const fileFilter = (_: any, file: Express.Multer.File, cb: Function) => {
  const allowedFormats = ["jpg", "jpeg", "png", "pdf"];
  const extension = file?.originalname?.split(".")?.pop();

  if (!allowedFormats.includes(extension.toLowerCase())) {
    cb(
      new NotAcceptableException(
        `Invalid file type, expected file types includes, ${allowedFormats.join(
          ", "
        )}`
      ),
      false
    );
    return;
  }

  cb(null, true);
};

const fileInterceptonOptions: MulterOptions = {
  dest: "./uploads",
  limits: {
    fileSize: 31457280, // 30 Megabytes
  },
  fileFilter,
};

export default fileInterceptonOptions;