import express from "express";
import * as AdminController from "../controller/admin.controller";
import authAdmin from "../middleware/admin.auth";

const adminRouter = express.Router();

adminRouter.post("/login", AdminController.handelLoginAdmin);
adminRouter.post("/add-doctor", authAdmin,  AdminController.handelAddDoctor);



export default adminRouter;