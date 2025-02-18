import express from "express";
import * as AdminController from "../controller/admin.controller";
import authAdmin from "../middleware/admin.auth";
import upload from "../middleware/multer";

const adminRouter = express.Router();


/**
 * @swagger
 * /api/v1/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
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
 *         description: Invalid Credentials
 *       500:
 *         description: Server error
 */
adminRouter.post("/login", AdminController.handelLoginAdmin);





/**
 * @swagger
 * /api/v1/admin/add-doctor:
 *   post:
 *     summary: Add a new doctor
 *     tags: [Admin]
 *     security:
 *       - XTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               specialty:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Doctor added successfully
 *       500:
 *         description: Server error
 */
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), AdminController.handelAddDoctor);



/**
 * @swagger
 * /api/v1/admin/appointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [Admin]
 *     security:
 *       - XTokenAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 *       500:
 *         description: Server error
 */
adminRouter.get("/appointments", authAdmin, AdminController.handelAppointmentsAdmin);


/**
 * @swagger
 * /api/v1/admin/cancel-appointment:
 *   put:
 *     summary: Cancel an appointment
 *     tags: [Admin]
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
 *       200:
 *         description: Appointment cancelled
 *       404:
 *         description: No appointment found
 *       500:
 *         description: Server error
 */
adminRouter.put("/cancel-appointment", authAdmin, AdminController.handelAppointmentCancel);



/**
 * @swagger
 * /api/v1/admin/all-doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Admin]
 *     security:
 *       - XTokenAuth: []
 *     responses:
 *       200:
 *         description: List of doctors
 *       500:
 *         description: Server error
 */

adminRouter.get("/all-doctors", authAdmin, AdminController.handelAllDoctors);


/**
 * @swagger
 * /api/v1/admin/change-availability:
 *   post:
 *     summary: Change doctor availability
 *     tags: [Admin]
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
 *         description: Availability changed
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Server error
 */
adminRouter.post("/change-availability", authAdmin, AdminController.changeAvailablity);




/**
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard data
 *     tags: [Admin]
 *     security:
 *       - XTokenAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 *       500:
 *         description: Server error
 */
adminRouter.get("/dashboard", authAdmin, AdminController.handelAdminDashboard);


export default adminRouter;