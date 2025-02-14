import joi from "joi";

export const doctorLoginValidation = joi.object({
    email: joi.string().required(),
    password: joi.string().required()
});

export const doctorCancelAppointment = joi.object({
    appointmentId: joi.string().required(),
    docId: joi.string().required()
});