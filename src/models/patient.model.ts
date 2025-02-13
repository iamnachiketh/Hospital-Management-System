import mongoose from "mongoose";
import IPatient from "../interface/patient.interface";

const patientSchema = new mongoose.Schema<IPatient>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: '000000000' },
    image: { type: String, default: "" },
    address: { type: Object, default: { line1: '', line2: '' } },
    gender: { type: String, default: 'Not Selected' },
    dob: { type: String, default: 'Not Selected' },
    password: { type: String, required: true },
    medicalHistory: { type: String, required: true },
    previousMedication: { type: String, default: "none" }
}, { timestamps: true });

export const patientModel = mongoose.model<IPatient>("patient", patientSchema);

