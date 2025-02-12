import { userModel } from "../models/user.model"
import jwt from "jsonwebtoken";
import httpcode from "http-status-codes";


export const registerUser = async function (data: any) {

    try {

        const isUserPresent = await userModel.findById({ id: data._id });

        if (isUserPresent) {
            return {
                status: httpcode.BAD_REQUEST,
                message: "User already exists",
                data: isUserPresent
            };
        }

        const newUser = new userModel(data);
        const user = await newUser.save();
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "3d"
            });

        return {
            status: httpcode.CREATED,
            message: "User has been created",
            token: token, data: user
        };

    } catch (error: any) {
        return { status: httpcode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }

}