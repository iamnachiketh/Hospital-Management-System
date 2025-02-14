import { Router } from "express";
import patientRouter from "./patient.router";
import doctorRouter from "./doctor.route";
import adminRouter from "./admin.router";



export const handleRouter = () => {
    const router = Router();

    router.use("/patients", patientRouter);

    router.use("/doctors", doctorRouter);

    router.use("/admin", adminRouter);

    return router;
}
