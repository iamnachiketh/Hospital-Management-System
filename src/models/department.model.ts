import mongoose from "mongoose";
import { IDepartment } from "../interface/department.interface";

const departmentSchema = new mongoose.Schema<IDepartment>({
    docIds: [{ type: String, required: true }],
    deptName: { type: String, required: true, unique: true },
    numberOfDoctors: { type: Number, default: 0 }
})

export const departmentModel = mongoose.model("departments", departmentSchema); 





