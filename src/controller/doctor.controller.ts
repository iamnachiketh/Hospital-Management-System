import { Request, Response } from "express";
import * as DoctorService from "../service/doctor.service";
import * as Validation from "../validation/doctor.validation";

export const handleLoginDoctor = async (req: Request, res: Response) => {

    try {

        const { email, password } = req.body;

        const { error } = Validation.doctorLoginValidation.validate({ email, password });

        if (error) {
            res.status(400).json({
                status: 400,
                message: "Email/Password required",
                data: null
            });
            return;
        }

        const response = await DoctorService.loginDoctor(email, password);

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


export const handelAppointmentsDoctor = async (req: Request, res: Response) => {
    try {

        const  docId  = req.query.id as string;

        const response = await DoctorService.appointmentDoctor(docId);

        res.status(response.status).json({
            status: response.status,
            message: response.message,
            data: response.data
        });

    } catch (error: any) {
        res.status(500).json({ status: 500, message: error.message, data: null });
    }
}