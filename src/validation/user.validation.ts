import joi from "joi";

export const userRegisterVlidation = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    medicalHistory: joi.string().required()
});


export const userLoginValidation = joi.object({
    email: joi.string().required(),
    password: joi.string().required()
});

export const userProfileValidate = joi.object({
    id: joi.string().required()
})

export const userUpdateProfile = joi.object({
    name: joi.string().required(),
    userId: joi.string().required(),
    phone: joi.string().required(),
    address: joi.string().required(),
    dob: joi.string().required(),
    gender: joi.string().required()
});


export const userAppointmentReq = joi.object({
    userId: joi.required(),
    docId: joi.required(),
    slotDate: joi.required(),
    slotTime: joi.required()
});