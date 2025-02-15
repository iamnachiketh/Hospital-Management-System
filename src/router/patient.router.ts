import express from "express";
import * as PatientController from "../controller/patient.controller";
import authPatient from "../middleware/patient.auth";

const patientRouter = express.Router();

patientRouter.post("/register", PatientController.handleRegisterPatient);
patientRouter.post("/login", PatientController.handleLoginPatient);

patientRouter.get("/get-profile", authPatient, PatientController.handleGetProfile);
patientRouter.post("/update-profile", authPatient, PatientController.handleUpdateProfile);
patientRouter.post("/book-appointment", authPatient, PatientController.handleBookAppointment);
patientRouter.put("/cancel-appointment", authPatient, PatientController.handelCancelAppointment);
patientRouter.get("/list-appointments", authPatient, PatientController.handelListAppointment);
patientRouter.get("/list-prescription", authPatient, PatientController.handelGetPrescriptions);
patientRouter.post("/payment-stripe", authPatient, PatientController.handelPaymentStripe);
patientRouter.post("/verifyStripe", authPatient, PatientController.handelVerifyStripe);


export default patientRouter;