import express from "express";
import * as PatientController from "../controller/patient.controller";
import patientAuth from "../middleware/patient.auth";

const patientRouter = express.Router();

patientRouter.post("/register", PatientController.handleRegisterPatient);
patientRouter.post("/login", PatientController.handleLoginPatient);

patientRouter.get("/get-profile", patientAuth, PatientController.handleGetProfile);
patientRouter.post("/update-profile", patientAuth, PatientController.handleUpdateProfile);
patientRouter.post("/book-appointment", patientAuth, PatientController.handleBookAppointment);
patientRouter.put("/cancel-appointment", patientAuth, PatientController.handelCancelAppointment);
patientRouter.get("/list-appointments", patientAuth, PatientController.handelListAppointment);

export default patientRouter;