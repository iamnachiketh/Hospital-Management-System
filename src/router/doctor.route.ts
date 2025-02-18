import express from "express";
import * as DoctorController from "../controller/doctor.controller";
import { authDoctor } from "../middleware/doctor.auth";

const doctorRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: Doctors
 */


/**
 * @swagger
 * /api/v1/doctors/login:
 *   post:
 *     summary: Doctor login
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Email/Password required
 *       500:
 *         description: Server error
 */
doctorRouter.post("/login", DoctorController.handleLoginDoctor);


/**
 * @swagger
 * /api/v1/doctors/appointments:
 *   get:
 *     summary: Get doctor appointments
 *     tags: [Doctors]
 *     security:
 *       - XTokenAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Server error
 */
doctorRouter.get("/appointments", authDoctor, DoctorController.handelAppointmentsDoctor);



/**
 * @swagger
 * /api/v1/doctors/cancel-appointment:
 *   put:
 *     summary: Cancel an appointment
 *     tags: [Doctors]
 *     security:
 *       - XTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               docId:
 *                 type: string
 *               appointmentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment canceled
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
doctorRouter.put("/cancel-appointment", authDoctor, DoctorController.handelAppointmentCancel);



/**
 * @swagger
 * /api/v1/doctors/list:
 *   get:
 *     summary: Get list of doctors
 *     tags: [Doctors]
 *     responses:
 *       200:
 *         description: List of doctors retrieved
 *       500:
 *         description: Server error
 */
doctorRouter.get("/list", DoctorController.handelDoctorList);



/**
 * @swagger
 * /api/v1/doctors/change-availability:
 *   post:
 *     summary: Change doctor availability
 *     tags: [Doctors]
 *     security:
 *       - XTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               docId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Availability updated
 *       500:
 *         description: Server error
 */
doctorRouter.put("/change-availability", authDoctor, DoctorController.handelChangeAvailablity);




/**
 * @swagger
 * /api/v1/doctors/complete-appointment:
 *   put:
 *     summary: Mark appointment as completed
 *     tags: [Doctors]
 *     security:
 *       - XTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               docId:
 *                 type: string
 *               appointmentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment marked as completed
 *       500:
 *         description: Server error
 */
doctorRouter.put("/complete-appointment", authDoctor, DoctorController.handelAppointmentComplete);



/**
 * @swagger
 * /api/v1/doctors/dashboard:
 *   get:
 *     summary: Get doctor dashboard
 *     tags: [Doctors]
 *     security:
 *       - XTokenAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dashboard data retrieved
 *       500:
 *         description: Server error
 */
doctorRouter.get("/dashboard", authDoctor, DoctorController.handelDoctorDashboard);



/**
 * @swagger
 * /api/v1/doctors/profile:
 *   get:
 *     summary: Get doctor profile
 *     tags: [Doctors]
 *     security:
 *       - XTokenAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor profile retrieved
 *       500:
 *         description: Server error
 */
doctorRouter.get("/profile", authDoctor, DoctorController.handelDoctorProfile);



/**
 * @swagger
 * /api/v1/doctors/update-profile:
 *   put:
 *     summary: Update doctor profile
 *     tags: [Doctors]
 *     security:
 *       - XTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               docId:
 *                 type: string
 *               fees:
 *                 type: number
 *               address:
 *                 type: string
 *               available:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Profile updated
 *       500:
 *         description: Server error
 */
doctorRouter.put("/update-profile", authDoctor, DoctorController.handelUpdateDoctorProfile);





/**
 * @swagger
 * /api/v1/doctors/prescription:
 *   post:
 *     summary: Add prescription
 *     tags: [Doctors]
 *     security:
 *       - XTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointmentId:
 *                 type: string
 *               medication:
 *                 type: string
 *     responses:
 *       200:
 *         description: Prescription added
 *       500:
 *         description: Server error
 */

doctorRouter.post("/prescription", authDoctor, DoctorController.handelAddPrescription);


export default doctorRouter;