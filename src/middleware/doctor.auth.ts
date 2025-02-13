import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";

export const authDoctor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dtoken = req.headers["x-token"] as string;
    if (!dtoken) {
        res.status(401).json({ status: 401, message: 'Not Authorized Login Again', data: null });
        return;
    }
    try {
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET as string);
        if (typeof token_decode !== "string" && "id" in token_decode) {
            req.body.docId = token_decode.id;
            next();
        } else {
            res.status(500).json({
                status: 500,
                message: "Token is not valid",
                data: null
            });
            return;

        }
    } catch (error: any) {
        res.status(500).json({ status: 500, message: error.message, data: null })
    }
}

export default authDoctor;