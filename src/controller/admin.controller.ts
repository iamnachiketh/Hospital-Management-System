import { Request, Response } from "express";
import { addDoctor } from "../validation/doctor.validation";
import { v2 as cloudinary } from "cloudinary";
import * as AdminService from "../service/admin.service";
import bcrypt from "bcryptjs";
import { logger } from "../logger";

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

        const imageFile = req.file || " ";

        const { error } = addDoctor.validate({
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            fees,
            address
        });

        if (error) {
            res.status(400).json({
                status: 400,
                message: error.message,
                data: null
            });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let imageUpload, imageUrl;

        if (imageFile && imageFile !== " ") {
            imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            imageUrl = imageUpload.secure_url;
        }
        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: address,
            date: Date.now()
        }

        const response = await AdminService.addDoctor(doctorData);

        res.status(response.status).json({
            status: response.status,
            message: response.message,
            data: response.data
        });

    } catch (error: any) {
        res.status(500).json({ status: 500, message: error.message, data: null });
    }
}



export const handelAppointmentsAdmin = async (req: Request, res: Response) => {
    try {

        logger.info(req.body);
        const response = await AdminService.appointmentAdmin();

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

        const { appointmentId } = req.body;

        const response = await AdminService.appointmentCancel(appointmentId);

        res.status(response.status).json({
            status: response.status,
            message: response.message,
            data: response.data
        });
    } catch (error: any) {
        res.status(500).json({ status: 500, message: error.message, data: null });
    }

}


export const handelAllDoctors = async (req: Request, res: Response) => {
    try {

        logger.info(req.body);
        const response = await AdminService.allDoctors();
        res.status(response.status).json({
            status: response.status,
            message: response.message,
            data: response.data
        });

    } catch (error: any) {
        res.status(500).json({ status: 500, message: error.message, data: null });
    }
}



export const changeAvailablity = async (req: Request, res: Response) => {
    try {

        const { docId } = req.body;

        const response = await AdminService.changeAvailablity(docId);

        res.status(response.status).json({
            status: response.status,
            message: response.message,
            data: response.data
        });

    } catch (error: any) {
        res.status(500).json({ status: 500, message: error.message, data: null });
    }
}


export const handelAdminDashboard = async (req: Request, res: Response) => {
    try {

        logger.info(req.body);
        const response = await AdminService.adminDashboard();

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