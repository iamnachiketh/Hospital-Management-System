import { doctorModel } from "../models/doctor.model";
import { appointmentModel } from "../models/appointment.model";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import httpCode from "http-status-codes";


export const loginDoctor = async function (email: string, password: string) {
    try {

        const doctor = await doctorModel.findOne({ email }, { __v: 0 });

        if (!doctor) {
            return { status: httpCode.BAD_REQUEST, message: "Invalid credentials", data: null };
        }

        // const isMatch = await bcrypt.compare(password, doctor.password)

        const isMatch = password === doctor.password;

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET as string);
            return { status: httpCode.OK, message: "Doctor has been successfully logged in", data: doctor, token };
        }

        return { status: httpCode.BAD_REQUEST, message: "Invalid credentials", data: null };

    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}


export const appointmentDoctor = async function (docId: string) {
    try {
        const appointments = await appointmentModel.find({ docId }, { __v: 0 });
        if (!appointments) {
            return { status: httpCode.NOT_FOUND, message: "Appointment not found", data: null };
        }
        return { status: httpCode.OK, message: "List of appointment", data: appointments };
    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}