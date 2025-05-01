"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonValidators = void 0;
exports.commonValidators = {
    email: {
        field: 'email',
        validators: [
            (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            }
        ]
    },
    password: {
        field: 'password',
        validators: [
            (value) => value.length >= 6,
            (value) => /[A-Z]/.test(value),
            (value) => /[a-z]/.test(value),
            (value) => /[0-9]/.test(value)
        ]
    },
    requiredString: (field) => ({
        field,
        validators: [
            (value) => value && value.trim().length > 0
        ]
    })
};
//# sourceMappingURL=common.js.map