import { Request, Response } from "express";
import * as UserService from "../service/user.service";
import * as Validation from "../validation/user.validation";
import bcrypt from "bcryptjs";

export const handleRegisterUser = async (req: Request, res: Response) => {

    try {
        const { name, email, password, medicalHistory } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
            medicalHistory
        }

        const { error } = Validation.userRegisterVlidation.validate(userData);

        if (error) {
            res
                .status(400)
                .json({
                    status: 400,
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



export const handleLoginUser = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;

        const data = {
            email,
            password
        };

        const { error } = Validation.userLoginValidation.validate(data);

        if (error) {
            res.status(400).json({
                status: 400,
                message: error.message,
                data: null
            });
            return;
        }

        const response = await UserService.loginUser(data);

        res.status(response.status).json({
            status: response.status,
            message: response.message,
            data: response.data,
            token: response?.token
        });

    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            status: 500, message: error.message, data: null
        });
    }
}


export const handleGetProfile = async (req: Request, res: Response) => {
    try {
        const id = req.query.id as string;

        const { error } = Validation.userProfileValidate.validate(id);

        if (error) {
            res.status(400).json({
                status: 400,
                message: "User id is required",
                data: null
            });
            return;
        }

        const response = await UserService.getProfile(id);

        res.status(response.status).json({
            status: response.status,
            message: response.message,
            data: response.data
        });

    } catch (error: any) {
        res.status(500).json({ status: 500, message: error.message, data: null });
    }
}


export const handleUpdateProfile = async (req: Request, res: Response) => {

    try {

        const { userId, name, phone, address, dob, gender } = req.body;

        const data = {
            userId,
            name,
            phone,
            address,
            dob,
            gender
        };

        const { error } = Validation.userUpdateProfile.validate(data);

        if (error) {
            res.status(500).json({
                status: 500,
                message: error.message,
                data: null
            });
            return;
        }

        const response = await UserService.updateProfile(data);

        res.status(response.status).json({
            status: response.status,
            message: response.message,
            data: response.data
        });

    } catch (error: any) {
        res.status(500).json({
            status: 500,
            message: error.message,
            data: null
        });
    }
}


export const handleBookAppointment = async (req: Request, res: Response) => {

    try {

        const { userId, docId, slotDate, slotTime } = req.body;

        const data = {
            userId,
            docId,
            slotDate,
            slotTime
        }

        const response = await UserService.bookAppointment(data);

        res.status(response.status).json({
            status: response.status,
            message: response.message,
            data: response.data
        });

    } catch (error: any) {
        res.status(500).json({
            status: 500,
            message: error.message,
            data: null
        });
    }

}