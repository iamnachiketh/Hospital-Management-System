import joi from "joi";

export const doctorLoginValidation = joi.object({
    email: joi.string().required(),
    password: joi.string().required()
});

export const doctorCancelAppointment = joi.object({
    appointmentId: joi.string().required(),
    docId: joi.string().required()
});


export const addDoctor = joi.object({
    name: joi.string().required(), 
    email: joi.string().email().required(), 
    password: joi.string().required(), 
    speciality: joi.string().required(), 
    degree: joi.string().required(), 
    experience: joi.string().required(), 
    about: joi.string(), 
    fees: joi.number().required(), 
    address: joi.object({
        line1: joi.string().required(),
        line2: joi.string()
    }).required()
})