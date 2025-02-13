import mongoose from "mongoose"
import IAppointment from "../interface/appointment.interface"

const appointmentSchema = new mongoose.Schema<IAppointment>({
    patientId: { type: String, required: true },
    docId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    patientData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false }
}, { timestamps: true })

export const appointmentModel = mongoose.model<IAppointment>("appointment", appointmentSchema)
