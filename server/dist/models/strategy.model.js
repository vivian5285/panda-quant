"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy = exports.StrategyStatus = void 0;
const mongoose_1 = require("mongoose");
var StrategyStatus;
(function (StrategyStatus) {
    StrategyStatus["ACTIVE"] = "active";
    StrategyStatus["INACTIVE"] = "inactive";
    StrategyStatus["PAUSED"] = "paused";
    StrategyStatus["COMPLETED"] = "completed";
})(StrategyStatus || (exports.StrategyStatus = StrategyStatus = {}));
const strategySchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        enum: Object.values(StrategyStatus),
        required: true,
        default: StrategyStatus.ACTIVE
    },
    parameters: { type: mongoose_1.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
strategySchema.methods['toJSON'] = function () {
    const obj = this['toObject']();
    delete obj.__v;
    return obj;
};
exports.Strategy = (0, mongoose_1.model)('Strategy', strategySchema);
exports.default = exports.Strategy;
//# sourceMappingURL=strategy.model.js.map