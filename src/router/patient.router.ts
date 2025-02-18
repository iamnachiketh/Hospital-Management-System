import express from "express";
import * as PatientController from "../controller/patient.controller";
import authPatient from "../middleware/patient.auth";

const patientRouter = express.Router();

/**
 * @openapi
 * /api/v1/patients/register:
 *   post:
 *     summary: Register a new patient
 *     tags:
 *       - Patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               medicalHistory:
 *                 type: string
 *               previousMedication:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Patient registered successfully
 *       '400':
 *         description: Validation error
 *       '500':
 *         description: Server error
 */
patientRouter.post("/register", PatientController.handleRegisterPatient);



/**
 * @openapi
 * /api/v1/patients/login:
 *   post:
 *     summary: Login a patient
 *     tags:
 *       - Patient
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
 *       '200':
 *         description: Login successful, returns JWT
 *       '400':
 *         description: Validation error
 *       '500':
 *         description: Server error
 */
patientRouter.post("/login", PatientController.handleLoginPatient);



/**
 * @openapi
 * /api/v1/patients/get-profile:
 *   get:
 *     summary: Get patient profile
 *     security:
 *       - XTokenAuth: []
 *     tags:
 *       - Patient
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: Patient profile retrieved successfully
 *       '500':
 *         description: Server error
 */
patientRouter.get("/get-profile", authPatient, PatientController.handleGetProfile);


/**
 * @openapi
 * /api/v1/patients/update-profile:
 *   put:
 *     summary: Update patient profile
 *     security:
 *       - XTokenAuth: []
 *     tags:
 *       - Patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               dob:
 *                 type: string
 *               gender:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Profile updated successfully
 *       '500':
 *         description: Server error
 */
patientRouter.put("/update-profile", authPatient, PatientController.handleUpdateProfile);


/**
 * @openapi
 * /api/v1/patients/book-appointment:
 *   post:
 *     summary: Book an appointment
 *     security:
 *       - XTokenAuth: []
 *     tags:
 *       - Patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *               docId:
 *                 type: string
 *               slotDate:
 *                 type: string
 *               slotTime:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Appointment booked successfully
 *       '400':
 *         description: Validation error
 *       '500':
 *         description: Server error
 */
patientRouter.post("/book-appointment", authPatient, PatientController.handleBookAppointment);



/**
 * @openapi
 * /api/v1/patients/cancel-appointment:
 *   put:
 *     summary: Cancel an appointment
 *     security:
 *       - XTokenAuth: []
 *     tags:
 *       - Patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *               appointmentId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Appointment canceled successfully
 *       '400':
 *         description: Validation error
 *       '500':
 *         description: Server error
 */
patientRouter.put("/cancel-appointment", authPatient, PatientController.handelCancelAppointment);




/**
 * @openapi
 * /api/v1/patients/list-appointments:
 *   get:
 *     summary: Get list of patient appointments
 *     tags:
 *       - Patient
 *     security:
 *       - XTokenAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Returns list of appointments
 *       '400':
 *         description: Validation error
 *       '500':
 *         description: Server error
 */
patientRouter.get("/list-appointments", authPatient, PatientController.handelListAppointment);


/**
 * @openapi
 * /api/v1/patients/list-prescription:
 *   get:
 *     summary: Get list of prescriptions for a patient
 *     tags:
 *       - Patient
 *     security:
 *       - XTokenAuth: []
 *     responses:
 *       '200':
 *         description: List of prescriptions retrieved successfully
 *       '400':
 *         description: Validation error
 *       '500':
 *         description: Server error
 */
patientRouter.get("/list-prescription", authPatient, PatientController.handelGetPrescriptions);


/**
 * @openapi
 * /api/v1/patients/payment-stripe:
 *   post:
 *     summary: Initiate payment using Stripe
 *     tags:
 *       - Patient
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
 *     responses:
 *       '200':
 *         description: Payment session created successfully
 *       '400':
 *         description: Validation error
 *       '500':
 *         description: Server error
 */
patientRouter.post("/payment-stripe", authPatient, PatientController.handelPaymentStripe);



/**
 * @openapi
 * /api/v1/patients/verifyStripe:
 *   post:
 *     summary: Verify Stripe payment status
 *     tags:
 *       - Patient
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
 *               status:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Payment verification successful
 *       '400':
 *         description: Validation error
 *       '500':
 *         description: Server error
 */
patientRouter.post("/verifyStripe", authPatient, PatientController.handelVerifyStripe);


export default patientRouter;