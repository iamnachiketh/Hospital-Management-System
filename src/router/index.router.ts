import { Router } from "express";
import { swaggerSpec } from "../swagger/swagger";
import patientRouter from "./patient.router";
import doctorRouter from "./doctor.route";
import adminRouter from "./admin.router";
import swaggerUi from "swagger-ui-express";




export const handleRouter = () => {
    const router = Router();
    
    router.use("/patients", patientRouter);

    router.use("/doctors", doctorRouter);

    router.use("/admin", adminRouter);

    router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    return router;
}
