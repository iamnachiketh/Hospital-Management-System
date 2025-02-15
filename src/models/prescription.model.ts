import mongoose from "mongoose";
import IPrescription from "../interface/prescription.model";


const prescriptionSchema = new mongoose.Schema<IPrescription>({
    patientId: { type: String, required: true },
    appointmentId: { type: String, required: true },
    medication: { type: String, required: true }
}, { timestamps: true });


export const prescriptionModel = mongoose.model<IPrescription>("prescription", prescriptionSchema);