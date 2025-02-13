import { doctorModel } from "../models/doctor.model";
import { appointmentModel } from "../models/appointment.model";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import httpCode from "http-status-codes";


export const loginDoctor = async function (email: string, password: string) {
    try {

        const user = await doctorModel.findOne({ email }, { __v: 0 });

        if (!user) {
            return { status: httpCode.BAD_REQUEST, message: "Invalid credentials", data: null };
        }

        // const isMatch = await bcrypt.compare(password, user.password)

        const isMatch = password === user.password;

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);
            return { status: httpCode.OK, message: "Doctor has been successfully logged in", data: user, token };
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