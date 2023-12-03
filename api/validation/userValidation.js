const Joi = require("joi");

const passwordSchema = Joi.string()
.min(6).max(100)
.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/)
.required()
.messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password must be at least {{#limit}} characters long',
    'string.max': 'Password must be at most {{#limit}} characters long',
    'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one digit',
    'any.required': 'Password is required',
});

exports.validUser = (_reqBody) => {
    const joiSchema = Joi.object({
        firstName: Joi.string().min(2).max(100).required(),
        lastName: Joi.string().min(2).max(100).required(),
        email: Joi.string().min(2).max(100).email().required(),
        password: passwordSchema,
        role: Joi.string().valid('admin', 'user'),
    });

    return joiSchema.validate(_reqBody);
};


exports.validLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(100).email().required(),
        password: passwordSchema
    })

    return joiSchema.validate(_reqBody);
}