import { expect } from "chai";
import request from "supertest";
import app from "../src/index";
import httpCode from "http-status-codes";

const testPatient = {
    name: "Test User",
    email: "testuser@example.com",
    password: "Test@1234",
    medicalHistory: "none",
    previousMedication: "none"
};

let patientToken: string;
let patientId: string;
let appointmentId: string;


describe("Patient API Tests", () => {
    it("should register a new patient", async () => {
        const res = await request(app)
            .post("/api/v1/patients/register")
            .send(testPatient);

        expect(res.status).to.equal(httpCode.CREATED);
        expect(res.body).to.have.property("token");
        patientToken = res.body.token;
        patientId = res.body.data._id;
    });


    it("should log in an existing patient", async () => {
        const res = await request(app)
            .post("/api/v1/patients/login")
            .send({ email: testPatient.email, password: testPatient.password });

        expect(res.status).to.equal(httpCode.OK);
        expect(res.body).to.have.property("token");
        patientToken = res.body.token;
    });


    it("should retrieve the patient's profile", async () => {
        const res = await request(app)
            .get(`/api/v1/patients/get-profile?id=${patientId}`)
            .set("x-token", `${patientToken}`);

        expect(res.status).to.equal(httpCode.OK);
        expect(res.body.data).to.have.property("email").equal(testPatient.email);
    });

    
    it("should update patient profile", async () => {
        const res = await request(app)
            .put("/api/v1/patients/update-profile")
            .set("x-token", `${patientToken}`)
            .send({
                ...testPatient, 
                name: "Updated User", 
                patientId, 
                phone: "1234567890",
                address: JSON.stringify({ line1: "123 Main St", line2: "Test City" }),
                dob: "1990-01-01",
                gender: "Male"
            });

        expect(res.status).to.equal(httpCode.OK);
    });

    
    it("should book an appointment", async () => {
        const res = await request(app)
            .post("/api/v1/patients/book-appointment")
            .set("x-token", `${patientToken}`)
            .send({ patientId, docId: "67adf9cb6daa80fea562d152", slotDate: "2025-03-01", slotTime: "10:00 AM" });

        expect(res.status).to.equal(httpCode.CREATED);
        appointmentId = res.body.data._id;
    });

    
    // it("should cancel an appointment", async () => {
    //     const res = await request(app)
    //         .put("/api/v1/patients/cancel-appointment")
    //         .set("x-token", `${patientToken}`)
    //         .send({ appointmentId, patientId });

    //     expect(res.status).to.equal(httpCode.OK);
    // });

    
    it("should retrieve a list of appointments", async () => {
        const res = await request(app)
            .get(`/api/v1/patients/list-appointments?id=${patientId}`)
            .set("x-token", `${patientToken}`);

        expect(res.status).to.equal(httpCode.OK);
        expect(res.body.data).to.be.an("array");
    });


    it("should retrieve the patient’s prescriptions", async () => {
        const res = await request(app)
            .get(`/api/v1/patients/list-prescription?id=${patientId}`)
            .set("x-token", `${patientToken}`);

        expect(res.status).to.equal(httpCode.OK);
    });

    
    it("should create a payment session", async () => {
        const res = await request(app)
            .post("/api/v1/patients/payment-stripe")
            .set("x-token", `${patientToken}`)
            .send({ appointmentId, origin: "http://localhost:3000/api/v1/patients" });

        expect(res.status).to.equal(httpCode.CREATED);
        expect(res.body).to.have.property("session_url");
    });
});
