const Joi = require("joi");

exports.validateToy = (_reqBody) => {
    let schemaJoi = Joi.object({
        name: Joi.string().min(2).max(100).required(),
        produced_country: Joi.string().min(2).max(50).required(),
        info: Joi.string().min(3).max(1000),
        category: Joi.string().min(3).max(50).required(),
        img_url: Joi.string().allow(null, "").max(500),
        price: Joi.number().min(0.5).max(Number.MAX_SAFE_INTEGER).required()
    })
    return schemaJoi.validate(_reqBody);
}