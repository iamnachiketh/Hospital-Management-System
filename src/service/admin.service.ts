import jwt from "jsonwebtoken";
import httpCode from "http-status-codes";
import { doctorModel } from "../models/doctor.model";

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


export const addAdmin = async function (doctorData: any) {
    try {
        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();
        return { status: httpCode.CREATED, message: "Doctor Added", data: newDoctor };
    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}