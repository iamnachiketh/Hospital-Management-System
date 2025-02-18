import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"


const patientAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> =>  {

    let token = req.headers["x-token"];

    if (!token) {
        res.status(404).json({
            status: 404,
            message: "Not Authorized Login Again",
            data: null
        });
        return;
    }

    try {
        const token_decode = jwt.verify(token as string, process.env.JWT_SECRET as string);

        if (typeof token_decode !== "string" && "id" in token_decode) {
            req.body.paitentId = token_decode.id;
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
        res.status(500).json({
            status: 500,
            message: error.message,
            data: null
        });
    }
}

export default patientAuth;