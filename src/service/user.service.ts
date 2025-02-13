import { userModel } from "../models/user.model";
import { doctorModel } from "../models/doctor.model";
import { appointmentModel } from "../models/appointment.model";
import jwt from "jsonwebtoken";
import httpcode from "http-status-codes";
import bcrypt from "bcryptjs";


export const registerUser = async function (data: any) {

    try {

        const isUserPresent = await userModel.findOne({ email: data.email }, { __v: 0 });

        if (isUserPresent) {
            return {
                status: httpcode.BAD_REQUEST,
                message: "User already exists",
                data: isUserPresent
            };
        }

        const newUser = new userModel(data, { __v: 0 });
        const user = await newUser.save();
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "3d"
            });

        return {
            status: httpcode.CREATED,
            message: "User has been created",
            token: token, data: user
        };

    } catch (error: any) {
        return { status: httpcode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }

}


export const loginUser = async (data: { email: string, password: string }) => {
    try {
        const user = await userModel.findOne({ email: data.email }, { __v: 0 });

        if (!user) {
            return { status: httpcode.BAD_REQUEST, message: "User does not exist", data: null };
        }

        const isMatch = await bcrypt.compare(data.password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);
            return { status: httpcode.OK, token: token, message: "User Successfuly logged in", data: user };
        }

        return { status: httpcode.BAD_REQUEST, message: "Invalid credentials", data: null };
    } catch (error: any) {

        return { status: httpcode.INTERNAL_SERVER_ERROR, message: error.message, data: null };

    }
}


export const getProfile = async function (userId: string) {
    try {
        const userData = await userModel.findById(userId, { __v: 0 });

        if (!userData) {
            return { status: httpcode.NOT_FOUND, message: "USER NOT FOUND", data: null };
        }

        return { status: httpcode.OK, message: "User Details", data: userData };

    } catch (error: any) {
        return { status: httpcode.INTERNAL_SERVER_ERROR, message: error.message, data: null }
    }
}


export const updateProfile = async function (data: any) {
    try {

        const userData = await userModel.findByIdAndUpdate(data.userId, {
            name: data.name,
            phone: data.phone,
            address: JSON.parse(data.address),
            dob: data.dob,
            gender: data.gender
        }, { new: true });

        if (!userData) {
            return { status: httpcode.BAD_REQUEST, message: "User not found", data: null };
        }

        return { status: httpcode.OK, message: "User has been updated", data: null };

    } catch (error: any) {
        return { status: httpcode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}


export const bookAppointment = async function (data: {
    userId: string,
    docId: string,
    slotDate: string,
    slotTime: string
}) {
    try {
        const docData = await doctorModel.findById(data.docId, { __v: 0 });

        if (!docData?.available) {
            return { status: httpcode.BAD_REQUEST, message: "Doctor Not Available", data: null };
        }

        let slots_booked = docData.slots_booked || {};

        if (slots_booked[data.slotDate]) {
            if (slots_booked[data.slotDate].includes(data.slotTime)) {
                return { status: httpcode.BAD_REQUEST, message: "Slot Not Available", data: null };
            }
            else {
                slots_booked[data.slotDate].push(data.slotTime);
            }
        } else {
            slots_booked[data.slotDate] = []
            slots_booked[data.slotDate].push(data.slotTime);
        }

        const userData = await userModel.findById(data.userId, { __v: 0 });

        delete docData.slots_booked

        const appointmentData = {
            userId: data.userId,
            docId: data.docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime: data.slotTime,
            slotDate: data.slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        await doctorModel.findByIdAndUpdate(data.docId, { slots_booked })

        return { status: httpcode.CREATED, message: "Appointment Booked", data: newAppointment }

    } catch (error: any) {
        return { status: httpcode.INTERNAL_SERVER_ERROR, message: error.message, data: null }
    }
}




export const cancellAppointment = async function (appointmentId: string, userId: string) {
    try {
        const appointmentData = await appointmentModel.findById({ _id: appointmentId });

        if (appointmentData?.userId !== userId) {
            return { status: httpcode.UNAUTHORIZED, message: "Unauthorized action", data: null };
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        const { docId, slotDate, slotTime } = appointmentData;

        const doctorData = await doctorModel.findById(docId, { __v: 0 });

        let slots_booked = doctorData?.slots_booked;

        if (slots_booked && slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter((e: any) => e !== slotTime);
            await doctorModel.findByIdAndUpdate(docId, { slots_booked });
            return { status: httpcode.OK, message: "Appointment has been cancled", data: null };
        }

        return { status: httpcode.NOT_FOUND, message: "Slots for the doctor not exists", data: null };

    } catch (error: any) {
        return { status: httpcode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}


export const listOfAppointments = async function (userId: string) {
    try {
        const appointments = await appointmentModel.find({ userId }, { __v: 0 });
        if (!appointments) {
            return { status: httpcode.NOT_FOUND, message: `No appointment for user id ${userId}`, data: null };
        }

        return { status: httpcode.OK, message: "List of appointments", data: appointments };

    } catch (error: any) {
        return { status: httpcode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}