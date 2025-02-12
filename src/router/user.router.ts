import express from "express";
import * as UserController from "../controller/user.controller";

const userRouter = express.Router();

userRouter.post("/register", UserController.handleRegisterUser);

export default userRouter;