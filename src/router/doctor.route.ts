import express from "express";
import * as DoctorController from "../controller/doctor.controller";
import { authDoctor } from "../middleware/doctor.auth";

const doctorRouter = express.Router();

doctorRouter.post("/login", DoctorController.handleLoginDoctor);
doctorRouter.get("/appointments", authDoctor, DoctorController.handelAppointmentsDoctor);
doctorRouter.put("/cancel-appointment", authDoctor, DoctorController.handelAppointmentCancel);
doctorRouter.get("/list", DoctorController.handelDoctorList);
doctorRouter.post("/change-availability", authDoctor, DoctorController.handelChangeAvailablity);
doctorRouter.put("/complete-appointment", authDoctor, DoctorController.handelAppointmentComplete);
doctorRouter.get("/dashboard", authDoctor, DoctorController.handelDoctorDashboard);
doctorRouter.get("/profile", authDoctor, DoctorController.handelDoctorProfile);
doctorRouter.put("/update-profile", authDoctor, DoctorController.handelUpdateDoctorProfile);
doctorRouter.post("/prescription", authDoctor, DoctorController.handelAddPrescription);


export default doctorRouter;