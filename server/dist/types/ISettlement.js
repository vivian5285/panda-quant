"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettlementStatus = exports.SettlementType = void 0;
var SettlementType;
(function (SettlementType) {
    SettlementType["DEPOSIT"] = "deposit";
    SettlementType["WITHDRAW"] = "withdraw";
})(SettlementType || (exports.SettlementType = SettlementType = {}));
var SettlementStatus;
(function (SettlementStatus) {
    SettlementStatus["PENDING"] = "pending";
    SettlementStatus["COMPLETED"] = "completed";
    SettlementStatus["FAILED"] = "failed";
    SettlementStatus["CANCELLED"] = "cancelled";
})(SettlementStatus || (exports.SettlementStatus = SettlementStatus = {}));
//# sourceMappingURL=ISettlement.js.map