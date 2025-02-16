import { patientModel } from "../models/patient.model";
import { doctorModel } from "../models/doctor.model";
import { appointmentModel } from "../models/appointment.model";
import { prescriptionModel } from "../models/prescription.model";
import redisClient from "../config/connect.redis";
import jwt from "jsonwebtoken";
import httpCode from "http-status-codes";
import bcrypt from "bcryptjs";
import stripe from "stripe";


const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY ?? " ", {
    apiVersion: "2025-01-27.acacia"
} as stripe.StripeConfig);


export const registerPatient = async function (data: any) {

    try {

        const isPatientPresent = await patientModel.findOne({ email: data.email }, { __v: 0 });

        if (isPatientPresent) {
            return {
                status: httpCode.BAD_REQUEST,
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
            status: httpCode.CREATED,
            message: "Patient has been created",
            token: token, data: patient
        };

    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }

}


export const loginPatient = async (data: { email: string, password: string }) => {
    try {
        const patient = await patientModel.findOne({ email: data.email }, { __v: 0 });

        if (!patient) {
            return { status: httpCode.BAD_REQUEST, message: "patient does not exist", data: null };
        }

        const isMatch = await bcrypt.compare(data.password, patient.password);

        if (isMatch) {
            const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET as string);
            return { status: httpCode.OK, token: token, message: "Patient Successfuly logged in", data: patient };
        }

        return { status: httpCode.BAD_REQUEST, message: "Invalid credentials", data: null };
    } catch (error: any) {

        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };

    }
}


export const getProfile = async function (patientId: string) {
    try {
        const patientData = await patientModel.findById(patientId, { __v: 0 });

        if (!patientData) {
            return { status: httpCode.NOT_FOUND, message: "PATIENT NOT FOUND", data: null };
        }

        return { status: httpCode.OK, message: "Patient Details", data: patientData };

    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null }
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
            return { status: httpCode.BAD_REQUEST, message: "Patient not found", data: null };
        }

        return { status: httpCode.OK, message: "Patient has been updated", data: null };

    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}


export const bookAppointment = async function (data: {
    patientId: string,
    docId: string,
    slotDate: string,
    slotTime: string
}) {

    const redisAppointmentListKey = `appointments:${data.patientId}`;

    try {
        const docData = await doctorModel.findById(data.docId, { __v: 0 });

        if (!docData?.available) {
            return { status: httpCode.BAD_REQUEST, message: "Doctor Not Available", data: null };
        }

        let slots_booked = docData.slots_booked || {};

        if (slots_booked[data.slotDate]) {
            if (slots_booked[data.slotDate].includes(data.slotTime)) {
                return { status: httpCode.BAD_REQUEST, message: "Slot Not Available", data: null };
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

        let listOfAppointmentsRedis = await redisClient.lRange(redisAppointmentListKey, -1, 0);

        listOfAppointmentsRedis.push(JSON.stringify(newAppointment));

        await redisClient.del(redisAppointmentListKey);

        const pipeline = redisClient.multi();

        listOfAppointmentsRedis.forEach((value) => pipeline.rPush(redisAppointmentListKey, value));

        pipeline.expire(redisAppointmentListKey, 3600);

        await pipeline.exec();

        return { status: httpCode.CREATED, message: "Appointment Booked", data: newAppointment }

    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null }
    }
}




export const cancellAppointment = async function (appointmentId: string, patientId: string) {

    const redisAppointmentListKey = `appointments:${patientId}`;

    try {
        const appointmentData = await appointmentModel.findById({ _id: appointmentId });

        if (appointmentData?.patientId !== patientId) {
            return { status: httpCode.UNAUTHORIZED, message: "Unauthorized action", data: null };
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        const { docId, slotDate, slotTime } = appointmentData;

        const doctorData = await doctorModel.findById(docId, { __v: 0 });

        let slots_booked = doctorData?.slots_booked;

        if (slots_booked && slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter((e: any) => e !== slotTime);
            await doctorModel.findByIdAndUpdate(docId, { slots_booked });

            let listOfAppointmentsRedis = await redisClient.lRange(redisAppointmentListKey, -1, 0);

            await redisClient.del(redisAppointmentListKey);

            listOfAppointmentsRedis = listOfAppointmentsRedis.filter((value) => (JSON.parse(value)).patientId !== patientId);

            const pipeline = redisClient.multi();

            listOfAppointmentsRedis.forEach((value) => pipeline.rPush(redisAppointmentListKey, value));

            pipeline.expire(redisAppointmentListKey, 3600);

            await pipeline.exec();

            return { status: httpCode.OK, message: "Appointment has been cancled", data: null };
        }

        return { status: httpCode.NOT_FOUND, message: "Slots for the doctor not exists", data: null };

    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}


export const listOfAppointments = async function (patientId: string) {

    const redisAppointmentListKey = `appointments:${patientId}`;

    try {

        const isAppointmentListExists = await redisClient.exists(redisAppointmentListKey);

        if (isAppointmentListExists) {
            const listOfAppointmentsRedis = await redisClient.lRange(redisAppointmentListKey, 0, -1);
            const newListOfAppointmentsRedis: JSON[] = listOfAppointmentsRedis.map((value) => JSON.parse(value));
            return { status: httpCode.OK, message: "List of appointments", data: newListOfAppointmentsRedis };
        }

        const appointments = await appointmentModel.find({ _id: patientId }, { __v: 0 });
        if (!appointments) {
            return { status: httpCode.NOT_FOUND, message: `No appointment for patient id ${patientId}`, data: null };
        }

        if (appointments.length > 0) {
            const pipeline = redisClient.multi();
            appointments.forEach((value) => pipeline.rPush(redisAppointmentListKey, JSON.stringify(value)));
            pipeline.expire(redisAppointmentListKey, 3600);
            await pipeline.exec();
        }

        return { status: httpCode.OK, message: "List of appointments", data: appointments };

    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}



export const getPrescriptions = async function (patientId: string) {

    try {
        const prescriptionData = await prescriptionModel.find({ patientId: patientId }, { __v: 0 });

        return { status: httpCode.OK, message: "List of prescription", data: prescriptionData };

    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }

}


export const paymentStripe = async function (appointmentId: string, origin: any) {
    try {
        const appointmentData = await appointmentModel.findById({ _id: appointmentId }, { __v: 0 });

        if (!appointmentData || appointmentData.cancelled) {
            return { status: httpCode.NOT_FOUND, message: "Appointment Cancelled or not found", data: null };
        }

        const currency = (process.env.CURRENCY as string).toLocaleLowerCase();

        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: "Appointment Fees"
                },
                unit_amount: appointmentData.amount * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
            cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
            line_items: line_items,
            mode: 'payment',
        });

        return { status: httpCode.CREATED, message: "Payment session", data: null, session_url: session.url };
    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}

export const verifyStripe = async function (appointmentId: string, status: number) {
    try {
        if (status === 201) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
            return { status: httpCode.OK, message: "Payment Successful", data: null };
        }

        return { status: httpCode.METHOD_FAILURE, message: "Payment Failed", data: null };
    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: "Payment Failed", data: null };

    }
}