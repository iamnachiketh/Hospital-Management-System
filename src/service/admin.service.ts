import jwt from "jsonwebtoken";
import httpCode from "http-status-codes";
import { doctorModel } from "../models/doctor.model";
import { appointmentModel } from "../models/appointment.model";

export const loginAdmin = async function (email: string, password: string) {
    try {
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET as string);
            return { status: httpCode.OK, token, message: "Admin logged in successfuly", data: null };
        }
        return { status: httpCode.BAD_REQUEST, message: "Invalid Credentials", data: null };
    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}


export const addDoctor = async function (doctorData: any) {
    try {
        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();
        return { status: httpCode.CREATED, message: "Doctor Added", data: newDoctor };
    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}


export const appointmentAdmin = async function () {
    try {
        const appointments = await appointmentModel.find({}, { __v: 0 });

        return { status: httpCode.OK, message: "List of Appointments", data: appointments };

    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}


export const appointmentCancel = async function (appointmentId: string) {
    try {
        const response = await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true }, { new: true });

        if (!response) {
            return { status: httpCode.NOT_FOUND, message: `No Appointment found with id ${appointmentId}`, data: null };
        }

        return { status: httpCode.OK, message: "Appointment has been cancled", data: response };

    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}


export const allDoctors = async function () {
    try {
        const doctors = await doctorModel.find({}, { __v: 0 });
        return { status: httpCode.OK, message: "List of Doctors", data: doctors };
    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
} 