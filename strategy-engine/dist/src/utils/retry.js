"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRetry = void 0;
const logger_1 = require("./logger");
const defaultOptions = {
    maxAttempts: 3,
    delay: 1000,
    backoffFactor: 2,
};
const withRetry = (fn_1, ...args_1) => __awaiter(void 0, [fn_1, ...args_1], void 0, function* (fn, options = {}) {
    const { maxAttempts, delay, backoffFactor } = Object.assign(Object.assign({}, defaultOptions), options);
    let lastError = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return yield fn();
        }
        catch (error) {
            lastError = error;
            (0, logger_1.logError)(lastError, `Attempt ${attempt} failed`);
            if (attempt === maxAttempts) {
                throw lastError;
            }
            const waitTime = delay * Math.pow(backoffFactor, attempt - 1);
            yield new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
    throw lastError;
});
exports.withRetry = withRetry;
