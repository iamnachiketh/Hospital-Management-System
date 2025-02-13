import { patientModel } from "../models/patient.model";
import { doctorModel } from "../models/doctor.model";
import { appointmentModel } from "../models/appointment.model";
import jwt from "jsonwebtoken";
import httpcode from "http-status-codes";
import bcrypt from "bcryptjs";


export const registerPatient = async function (data: any) {

    try {

        const isPatientPresent = await patientModel.findOne({ email: data.email }, { __v: 0 });

        if (isPatientPresent) {
            return {
                status: httpcode.BAD_REQUEST,
                message: "Patient already exists",
                data: isPatientPresent
            };
        }

        const newPatient = new patientModel(data, { __v: 0 });
        const patient = await newPatient.save();
        const token = jwt.sign(
            { id: patient._id },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "3d"
            });

        return {
            status: httpcode.CREATED,
            message: "Patient has been created",
            token: token, data: patient
        };

    } catch (error: any) {
        return { status: httpcode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }

}


export const loginPatient = async (data: { email: string, password: string }) => {
    try {
        const patient = await patientModel.findOne({ email: data.email }, { __v: 0 });

        if (!patient) {
            return { status: httpcode.BAD_REQUEST, message: "patient does not exist", data: null };
        }

        const isMatch = await bcrypt.compare(data.password, patient.password);

        if (isMatch) {
            const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET as string);
            return { status: httpcode.OK, token: token, message: "Patient Successfuly logged in", data: patient };
        }

        return { status: httpcode.BAD_REQUEST, message: "Invalid credentials", data: null };
    } catch (error: any) {

        return { status: httpcode.INTERNAL_SERVER_ERROR, message: error.message, data: null };

    }
}


export const getProfile = async function (patientId: string) {
    try {
        const patientData = await patientModel.findById(patientId, { __v: 0 });

        if (!patientData) {
            return { status: httpcode.NOT_FOUND, message: "PATIENT NOT FOUND", data: null };
        }

        return { status: httpcode.OK, message: "Patient Details", data: patientData };

    } catch (error: any) {
        return { status: httpcode.INTERNAL_SERVER_ERROR, message: error.message, data: null }
    }
}


export const updateProfile = async function (data: any) {
    try {

        const patientData = await patientModel.findByIdAndUpdate(data.patientId, {
            name: data.name,
            phone: data.phone,
            address: JSON.parse(data.address),
            dob: data.dob,
            gender: data.gender
        }, { new: true });

        if (!patientData) {
            return { status: httpcode.BAD_REQUEST, message: "Patient not found", data: null };
        }

        return { status: httpcode.OK, message: "Patient has been updated", data: null };

    } catch (error: any) {
        return { status: httpcode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}


export const bookAppointment = async function (data: {
    patientId: string,
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

        const patientData = await patientModel.findById(data.patientId, { __v: 0 });

        delete docData.slots_booked

        const appointmentData = {
            patientId: data.patientId,
            docId: data.docId,
            patientData,
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




export const cancellAppointment = async function (appointmentId: string, patientId: string) {
    try {
        const appointmentData = await appointmentModel.findById({ _id: appointmentId });

        if (appointmentData?.patientId !== patientId) {
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


export const listOfAppointments = async function (patientId: string) {
    try {
        const appointments = await appointmentModel.find({ patientId }, { __v: 0 });
        if (!appointments) {
            return { status: httpcode.NOT_FOUND, message: `No appointment for patient id ${patientId}`, data: null };
        }

        return { status: httpcode.OK, message: "List of appointments", data: appointments };

    } catch (error: any) {
        return { status: httpcode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}