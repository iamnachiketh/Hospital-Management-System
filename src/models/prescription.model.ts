import mongoose from "mongoose";
import IPrescription from "../interface/prescription.model";


const prescriptionModel = new mongoose.Schema<IPrescription>({
    patientId: { type: String, required: true },
    docId: { type: String, required: true },
    medication: { type: String, required: true }
}, { timestamps: true });


export const prescription = mongoose.model<IPrescription>("prescription", prescriptionModel);