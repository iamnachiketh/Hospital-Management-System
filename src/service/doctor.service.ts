import { doctorModel } from "../models/doctor.model";
import { appointmentModel } from "../models/appointment.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import httpCode from "http-status-codes";
import { prescriptionModel } from "../models/prescription.model";


export const loginDoctor = async function (email: string, password: string) {
    try {

        const doctor = await doctorModel.findOne({ email }, { __v: 0 });

        if (!doctor) {
            return { status: httpCode.BAD_REQUEST, message: "Invalid credentials", data: null };
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

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

export const cancelAppointmentDoctor = async function (appointmentId: string, docId: string) {

    try {
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return { status: httpCode.OK, message: "Appointment Cancelled", data: null };
        }
        return { status: httpCode.BAD_REQUEST, message: "Appointment Cancelled", data: null };
    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null }
    }

}


export const doctorList = async function () {
    try {
        const doctors = await doctorModel.find({}, { __v: 0 });

        if (!doctors) {
            return { status: httpCode.NOT_FOUND, message: "Doctors not found", data: null };
        }

        return { status: httpCode.OK, message: "List os Doctors", data: doctors };

    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}


export const changeAvailablity = async function (docId: string) {
    try {
        const docData = await doctorModel.findById(docId)

        if (!docData) {
            return { status: httpCode.NOT_FOUND, message: "Doctor not found", data: null };
        }

        await doctorModel.findByIdAndUpdate(docId, { available: !docData?.available });
        return { status: httpCode.OK, message: "Availablity Changed", data: null };
    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}


export const appointmentComplete = async function (appointmentId: string, docId: string) {
    try {
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate({ _id: appointmentId, cancelled: false }, { isCompleted: true })
            return { status: httpCode.OK, message: "Appointment Completed", data: appointmentData };
        }

        return { status: httpCode.NOT_FOUND, message: `Not Appointment with id ${appointmentId} has been found`, data: null };

    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}


export const doctorDashboard = async function (docId: string) {
    try {
        const appointments = await appointmentModel.find({ _id: docId, cancelled: false }, { __v: 0 });

        if (!appointments) {
            return { status: httpCode.NOT_FOUND, message: `No Appointments found for doctor with id ${docId}`, data: null };
        }

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients: any[] = []

        appointments.map((item) => {
            if (!patients.includes(item.patientId)) {
                patients.push(item.patientId)
            }
        })


        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse()
        }

        return { status: httpCode.OK, message: "Dashboard", data: dashData };

    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}


export const doctorProfile = async function (docId: string) {
    try {
        const profileData = await doctorModel.findById(docId);

        if (!profileData) {
            return { status: httpCode.NOT_FOUND, message: "Doctor not found", data: null };
        }

        return { status: httpCode.OK, message: "Doctor Details", data: profileData };

    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}



export const updateProfile = async function (data: {
    docId: string,
    fees: number,
    address: string,
    available: string
}) {
    try {
        const response = await doctorModel.findByIdAndUpdate(data.docId, {
            fees: data.fees,
            address: data.address,
            available: data.available
        }, { new: true });

        if (!response) {
            return { status: httpCode.NOT_FOUND, message: `Doctor with id ${data.docId} not present`, data: null }
        }

        return { status: httpCode.OK, message: "Doctor Details", data: response };

    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}



export const addPrescription = async function (appointmentId: string, medication: string) {
    try {
        const appointmentData = await appointmentModel.findOne({ _id: appointmentId }, { __v: 0 });

        if (!appointmentData) {
            return { status: httpCode.NOT_FOUND, message: "Appointment not found", data: null };
        }

        const prescriptionData = {
            appointmentId,
            patientId: appointmentData.patientId,
            medication
        }

        const prescription = new prescriptionModel(prescriptionData);
        await prescription.save();

        return { status: httpCode.CREATED, message: "Prescription has been genetated", data: null };

    } catch (error: any) {
        return { status: httpCode.INTERNAL_SERVER_ERROR, message: error.message, data: null };
    }
}