import joi from "joi";

export const doctorLoginValidation = joi.object({
    email: joi.string().required(),
    password: joi.string().required()
});