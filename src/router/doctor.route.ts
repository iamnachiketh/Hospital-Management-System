import express from "express";
import * as DoctorController from "../controller/doctor.controller";
import { authDoctor } from "../middleware/doctor.auth";

const doctorRouter = express.Router();

doctorRouter.post("/login", DoctorController.handleLoginDoctor);
doctorRouter.get("/appointments", authDoctor, DoctorController.handelAppointmentsDoctor);


export default doctorRouter;