import multer from "multer";
import { logger } from "../logger";

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        logger.info(req.body);
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });


export default upload;