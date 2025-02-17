import { Request, Response } from "express";
import * as PatientService from "../service/patient.service";
import * as Validation from "../validation/patient.validation";
import bcrypt from "bcryptjs";


export const handleRegisterPatient = async (req: Request, res: Response) => {

    try {
        const { name, email, password, medicalHistory, previousMedication } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const patientData = {
            name,
            email,
            password: hashedPassword,
            medicalHistory,
            previousMedication
        }

        const { error } = Validation.patientRegisterVlidation.validate(patientData);

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

        const response = await PatientService.registerPatient(patientData);

        res
            .status(response.status)
            .json({
                status: response.status,
                message: response.message,
                data: response.data,
                token: response?.token
            });

    } catch (error: any) {
        res.status(500).json({ status: 500, message: error.message, data: null });
    }
}



export const handleLoginPatient = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;

        const data = {
            email,
            password
        };

        const { error } = Validation.patientLoginValidation.validate(data);

        if (error) {
            res.status(400).json({
                status: 400,
                message: error.message,
                data: null
            });
            return;
        }

        const response = await PatientService.loginPatient(data);

        res.status(response.status).json({
            status: response.status,
            message: response.message,
            data: response.data,
            token: response?.token
        });

    } catch (error: any) {
        res.status(500).json({
            status: 500, message: error.message, data: null
        });
    }
}


export const handleGetProfile = async (req: Request, res: Response) => {
    try {
        const id = req.query.id as string;

        const response = await PatientService.getProfile(id);

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

        const { patientId, name, phone, address, dob, gender } = req.body;

        const data = {
            patientId,
            name,
            phone,
            address,
            dob,
            gender
        };

        const { error } = Validation.patientUpdateProfile.validate(data);

        if (error) {
            res.status(500).json({
                status: 500,
                message: error.message,
                data: null
            });
            return;
        }

        const response = await PatientService.updateProfile(data);

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

        const { patientId, docId, slotDate, slotTime } = req.body;

        const data = {
            patientId,
            docId,
            slotDate,
            slotTime
        }

        const { error } = Validation.patientAppointmentReqValidation.validate(data);

        if (error) {
            res.status(400).json({
                status: 400,
                message: error.message,
                data: null
            });
            return;
        }

        const response = await PatientService.bookAppointment(data);

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


export const handelCancelAppointment = async (req: Request, res: Response) => {
    try {

        const { patientId, appointmentId } = req.body;

        const { error } = Validation.patientAppointmentCancellValidation.validate({
            patientId,
            appointmentId
        });

        if (error) {
            res.status(400).json({
                status: 400,
                message: error.message,
                data: null
            });
            return;
        }

        const response = await PatientService.cancellAppointment(appointmentId, patientId);

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


export const handelListAppointment = async (req: Request, res: Response) => {
    try {

        const patientId = req.query.id as string;

        const response = await PatientService.listOfAppointments(patientId);

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


export const handelGetPrescriptions = async (req: Request, res: Response) => {

    try {
        const patientId = req.params.id as string;

        const response = await PatientService.getPrescriptions(patientId);

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


export const handelPaymentStripe = async (req: Request, res: Response) => {
    try {

        const { appointmentId } = req.body;
        const origin = req.headers["origin"];

        const response = await PatientService.paymentStripe(appointmentId, origin);

        res.status(response.status).json({
            status: response.status,
            message: response.message,
            data: response.data,
            session_url: response?.session_url
        });

    } catch (error: any) {
        res.status(500).json({
            status: 500,
            message: error.message,
            data: null
        });
    }
}



export const handelVerifyStripe = async (req: Request, res: Response) => {
    try {

        const { appointmentId, status } = req.body;

        const response = await PatientService.verifyStripe(appointmentId, status);

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
