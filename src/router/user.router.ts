import express from "express";
import * as UserController from "../controller/user.controller";
import authUser from "../middleware/user.auth";

const userRouter = express.Router();

userRouter.post("/register", UserController.handleRegisterUser);
userRouter.post("/login", UserController.handleLoginUser);

userRouter.get("/get-profile", authUser, UserController.handleGetProfile);
userRouter.post("/update-profile", authUser, UserController.handleUpdateProfile);
userRouter.post("/book-appointment", authUser, UserController.handleBookAppointment);
userRouter.post("/cancel-appointment", authUser, UserController.handelCancelAppointment);





export default userRouter;