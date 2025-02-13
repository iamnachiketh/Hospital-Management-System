import { Router } from "express";
import patientRouter from "./patient.router";
import doctorRouter from "./doctor.route";



export const handleRouter = () => {
    const router = Router();

    router.use("/patients", patientRouter);

    router.use("/doctors", doctorRouter);

    return router;
}
