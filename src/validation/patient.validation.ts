import joi from "joi";

export const patientRegisterVlidation = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    medicalHistory: joi.string().required(),
    previousMedication: joi.string().required()
});


export const patientLoginValidation = joi.object({
    email: joi.string().required(),
    password: joi.string().required()
});

export const patientProfileValidate = joi.object({
    id: joi.string().required()
})

export const patientUpdateProfile = joi.object({
    name: joi.string().required(),
    patientId: joi.string().required(),
    phone: joi.string().required(),
    address: joi.string().required(),
    dob: joi.string().required(),
    gender: joi.string().required()
});


export const patientAppointmentReqValidation = joi.object({
    patientId: joi.required(),
    docId: joi.required(),
    slotDate: joi.required(),
    slotTime: joi.required()
});

export const patientAppointmentCancellValidation = joi.object({
    patientId: joi.required(),
    appointmentId: joi.required()
})