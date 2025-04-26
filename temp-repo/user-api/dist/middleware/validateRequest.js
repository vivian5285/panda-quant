"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const validateRequest = (type) => {
    return async (req, res, next) => {
        const object = (0, class_transformer_1.plainToClass)(type, req.body);
        const errors = await (0, class_validator_1.validate)(object);
        if (errors.length > 0) {
            const message = errors.map((error) => Object.values(error.constraints || {})).join(', ');
            return res.status(400).json({ error: message });
        }
        next();
    };
};
exports.validateRequest = validateRequest;
