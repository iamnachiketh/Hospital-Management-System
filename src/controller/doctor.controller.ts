import { Request, Response } from "express";
import * as DoctorService from "../service/doctor.service";
import * as Validation from "../validation/doctor.validation";
import { logger } from "../logger";

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

        const docId = req.query.id as string;

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



export const handelAppointmentCancel = async (req: Request, res: Response) => {
    try {

        const { docId, appointmentId } = req.body;

        const { error } = Validation.doctorCancelAppointment.validate({ docId, appointmentId });

        if (error) {
            res.status(400).json({
                status: 400,
                message: error.message,
                data: null
            });
            return;
        }

        const response = await DoctorService.cancelAppointmentDoctor(appointmentId, docId);

        res.status(response.status).json({
            status: response.status,
            message: response.message,
            data: response.data
        });

    } catch (error: any) {
        res.status(500).json({ status: 500, message: error.message, data: null })
    }

}



export const handelDoctorList = async (req: Request, res: Response) => {
    try {

        logger.info(req.body);

        const response = await DoctorService.doctorList();

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


export const handelChangeAvailablity = async (req: Request, res: Response) => {
    try {

        const { docId } = req.body

        const response = await DoctorService.changeAvailablity(docId);

        res.status(response.status).json({
            status: response.status,
            message: response.message,
            data: response.data
        });

    } catch (error: any) {
        res.status(500).json({ status: 500, message: error.message, data: null });
    }
}


export const handelAppointmentComplete = async (req: Request, res: Response) => {
    try {

        const { docId, appointmentId } = req.body;

        const response = await DoctorService.appointmentComplete(appointmentId, docId);

        res.status(response.status).json({
            status: response.status,
            message: response.message,
            data: response.data
        });

    } catch (error: any) {
        res.status(500).json({ status: 500, message: error.message, data: null });
    }

}


export const handelDoctorDashboard = async (req: Request, res: Response) => {
    try {

        const docId = req.query.id as string;

        const response = await DoctorService.doctorDashboard(docId);

        res.status(response.status).json({
            status: response.status,
            message: response.message,
            data: response.data
        });

    } catch (error: any) {
        res.status(500).json({ status: 500, message: error.message, data: null });
    }
}



export const handelDoctorProfile = async (req: Request, res: Response) => {
    try {

        const docId = req.query.id as string;

        const response = await DoctorService.doctorProfile(docId);

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



export const handelUpdateDoctorProfile = async (req: Request, res: Response) => {
    try {

        const { docId, fees, address, available } = req.body;

        const response = await DoctorService.updateProfile({ docId, fees, address, available });

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


export const handelAddPrescription = async (req: Request, res: Response) => {
    try {
        const { appointmentId, medication } = req.body;

        const response = await DoctorService.addPrescription(appointmentId, medication);

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
        })
    }
}
