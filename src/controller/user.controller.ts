import { Request, Response } from "express";
import * as UserService from "../service/user.service";
import * as Validation from "../validation/user.validation";
import bcrypt from "bcryptjs";

export const handleRegisterUser = async (req: Request, res: Response) => {

    try {
        const { name, email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const { error } = await Validation.userRegisterVlidation.validateAsync(userData);

        if(error){
            res
            .status(error.status)
            .json({
                status: error.status, 
                message: error.message, 
                data: null
            });
            return;
        }

        const response = await UserService.registerUser(userData);

        res
            .status(response.status)
            .json({
                status: response.status,
                message: response.message,
                data: response.data,
                token: response?.token
            });

    } catch (error: any) {
        console.log(error)
        res.status(500).json({ status: 500, message: error.message, data: null });
    }
}