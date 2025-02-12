import { Router } from "express";
import userRouter from "./user.router";


export const handleRouter = () => {
    const router = Router();

    router.use("/users", userRouter);

    return router;
}
