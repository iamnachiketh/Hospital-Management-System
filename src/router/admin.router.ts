import express from "express";
import * as AdminController from "../controller/admin.controller";
import authAdmin from "../middleware/admin.auth";
import upload from "../middleware/multer";

const adminRouter = express.Router();

adminRouter.post("/login", AdminController.handelLoginAdmin);
adminRouter.post("/add-doctor", authAdmin,  upload.single("image"), AdminController.handelAddDoctor);
adminRouter.get("/appointments", authAdmin, AdminController.handelAppointmentsAdmin);
adminRouter.put("/cancel-appointment", authAdmin, AdminController.handelAppointmentCancel);
adminRouter.get("/all-doctors", authAdmin, AdminController.handelAllDoctors);
adminRouter.post("/change-availability", authAdmin, AdminController.changeAvailablity);
adminRouter.get("/dashboard", authAdmin, AdminController.handelAdminDashboard);


export default adminRouter;