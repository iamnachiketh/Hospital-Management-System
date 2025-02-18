import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import httpCode from "http-status-codes";


const authAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const atoken = req.headers["x-token"] as string;

        if (!atoken) {
            res.status(httpCode.UNAUTHORIZED).json({
                status: httpCode.UNAUTHORIZED,
                message: "Not Authorized Login Again",
                data: null
            });
            return
        }
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET as string);
        if (token_decode !== process.env.ADMIN_EMAIL as string + process.env.ADMIN_PASSWORD as string)  {
            res.status(httpCode.UNAUTHORIZED).json({
                status: httpCode.UNAUTHORIZED,
                message: "Not Authorized Login Again",
                data: null
            });
            return
        }
        next()
    } catch (error: any) {
        res.status(httpCode.INTERNAL_SERVER_ERROR).json({
            status: httpCode.INTERNAL_SERVER_ERROR,
            message: error.message,
            data: null
        });
    }
}

export default authAdmin;