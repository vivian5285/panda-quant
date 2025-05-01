"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettlementType = exports.SettlementStatus = void 0;
var SettlementStatus;
(function (SettlementStatus) {
    SettlementStatus["PENDING"] = "PENDING";
    SettlementStatus["COMPLETED"] = "COMPLETED";
    SettlementStatus["FAILED"] = "FAILED";
    SettlementStatus["CANCELLED"] = "CANCELLED";
})(SettlementStatus || (exports.SettlementStatus = SettlementStatus = {}));
var SettlementType;
(function (SettlementType) {
    SettlementType["DEPOSIT"] = "DEPOSIT";
    SettlementType["WITHDRAWAL"] = "WITHDRAWAL";
    SettlementType["REFUND"] = "REFUND";
    SettlementType["FEE"] = "FEE";
})(SettlementType || (exports.SettlementType = SettlementType = {}));
//# sourceMappingURL=settlement.types.js.map