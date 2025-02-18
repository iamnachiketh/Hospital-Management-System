import chai from "chai";
import supertest from "supertest";
import app from "../src/index";
import dotenv from "dotenv";

dotenv.config();
const { expect } = chai;
const request = supertest(app);
let adminToken: string;



const testDoctor = {
    name: "Dr. Test",
    email: "testdoctor@example.com",
    password: "test123",
    speciality: "Cardiology",
    degree: "MBBS",
    experience: "4 years",
    about: "test about",
    fees: 400,
    address: {
        line1: " ",
        line2: " " 
    }
};
let doctorId: string;
let appointmentId: string;





describe("Admin Authentication", function () {
    it("should login the admin and return a token", async function () {
        const res = await request.post("/api/v1/admin/login").send({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
        });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("token");
        adminToken = res.body.token;
    });
});





describe("Doctor Management", function () {
    it("should add a new doctor", async function () {
        const res = await request
            .post("/api/v1/admin/add-doctor")
            .set("x-token", `${adminToken}`)
            .send(testDoctor);
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("data");
        doctorId = res.body.data._id;
    });

    it("should fetch the list of doctors", async function () {
        const res = await request.get("/api/v1/admin/all-doctors").set("x-token", `${adminToken}`);
        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.an("array");
    });

    it("should toggle doctor availability", async function () {
        const res = await request
            .post(`/api/v1/admin/change-availability`)
            .set("x-token", `${adminToken}`)
            .send({ doctorId });
        expect(res.status).to.equal(200);
    });
});



describe("Appointment Management", function () {
    it("should fetch all appointments", async function () {
        const res = await request.get("/api/v1/admin/appointments").set("x-token", `${adminToken}`);
        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.an("array");
        if (res.body.data.length > 0) {
            appointmentId = res.body.data[0]._id;
        }
    });

    it("should cancel an appointment", async function () {
        if (appointmentId) {
            const res = await request
                .put("/api/v1/admin/cancel-appointment")
                .set("x-token", `${adminToken}`)
                .send({ appointmentId })
            expect(res.status).to.equal(200);
        }
    });
});



describe("Admin Dashboard", function () {
    it("should fetch dashboard data", async function () {
        const res = await request.get("/api/v1/admin/dashboard").set("x-token", `${adminToken}`);
        expect(res.status).to.equal(200);
        expect(res.body.data).to.have.property("doctors");
        expect(res.body.data).to.have.property("appointments");
        expect(res.body.data).to.have.property("patients");
    });
});
