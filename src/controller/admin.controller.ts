import { Request, Response } from "express";
import { addDoctor } from "../validation/doctor.validation";
import * as AdminService from "../service/admin.service";
import bcrypt from "bcryptjs";

export const handelLoginAdmin = async (req: Request, res: Response) => {
    try {

        const { email, password } = req.body;

        const response = await AdminService.loginAdmin(email, password);

        res.status(response.status).json({
            status: response.status,
            message: response.message,
            data: response.data,
            token: response?.token
        });

    } catch (error: any) {
        res.status(500).json({
            status: 500,
            message: error.message,
            data: null
        });

    }

}


export const handelAddDoctor = async (req: Request, res: Response) => {

    try {

        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;

        const { error } = addDoctor.validate({ name, email, password, speciality, degree, experience, about, fees, address });

        if(error){
            res.status(400).json({
                status: 400,
                message: error.message,
                data: null
            });
            return;
        }
        
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

        const doctorData = {
            name,
            email,
            image: " ",
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: address,
            date: Date.now()
        }

        const response = await AdminService.addAdmin(doctorData);

        res.status(response.status).json({
            status: response.status,
            message: response.message,
            data: response.data
        });

    } catch (error: any) {
        res.status(500).json({ status: 500, message: error.message, data: null });
    }
}