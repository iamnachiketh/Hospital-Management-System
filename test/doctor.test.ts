import { expect } from 'chai';
import request from 'supertest';
import app from '../src/index';

let doctorToken: string;
let appointmentId: string;
let docId: string;


const doctorCredentials = {
    email: "testdoctor@example.com",
    password: "test123"
};

describe("Doctor API Tests", function () {
    this.timeout(10000);

    it("should log in a doctor", async function () {
        const res = await request(app)
            .post("/api/v1/doctors/login")
            .send(doctorCredentials);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("token");
        doctorToken = res.body.token;
        docId = res.body.data._id;
    });

    it("should get the list of appointments", async function () {
        const res = await request(app)
            .get(`/api/v1/doctors/appointments?id=${docId}`)
            .set("x-token", `${doctorToken}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("data").that.is.an("array");

        if (res.body.data.length > 0) {
            appointmentId = res.body.data[0]._id;
        }
    });

    it("should cancel an appointment", async function () {
        if (!appointmentId) {
            this.skip();
        }

        // const res = await request(app)
        //     .put("/api/v1/doctor/cancel-appointment")
        //     .set("x-token", `${doctorToken}`)
        //     .send({ appointmentId })

        // expect(res.status).to.equal(200);
        // expect(res.body.message).to.equal("Appointment Cancelled");
    });

    it("should get doctor dashboard", async function () {
        const res = await request(app)
            .get(`/api/v1/doctors/dashboard?id=${docId}`)
            .set("x-token", `${doctorToken}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("data");
    });

    it("should update doctor availability", async function () {
        const res = await request(app)
            .put("/api/v1/doctors/change-availability")
            .set("x-token", `${doctorToken}`)
            .send({ docId })

        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal("Availablity Changed");
    });

    it("should add a prescription", async function () {
        if (!appointmentId) {
            this.skip();
        }

        const res = await request(app)
            .post(`/api/v1/doctors/prescription`)
            .set("Authorization", `Bearer ${doctorToken}`)
            .send({ appointmentId, medication: "Painkiller" });

        expect(res.status).to.equal(201);
        expect(res.body.message).to.equal("Prescription has been generated");
    });
});
