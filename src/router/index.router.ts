import { Router } from "express";
import userRouter from "./user.router";
import doctorRouter from "./doctor.route";



export const handleRouter = () => {
    const router = Router();

    router.use("/users", userRouter);

    router.use("/doctors", doctorRouter);

    return router;
}
