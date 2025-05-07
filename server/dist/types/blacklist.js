"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlacklistType = exports.BlacklistStatus = void 0;
var BlacklistStatus;
(function (BlacklistStatus) {
    BlacklistStatus["ACTIVE"] = "active";
    BlacklistStatus["INACTIVE"] = "inactive";
    BlacklistStatus["PENDING"] = "pending";
})(BlacklistStatus || (exports.BlacklistStatus = BlacklistStatus = {}));
var BlacklistType;
(function (BlacklistType) {
    BlacklistType["USER"] = "user";
    BlacklistType["PHONE"] = "phone";
    BlacklistType["ADDRESS"] = "address";
    BlacklistType["IP"] = "ip";
    BlacklistType["EMAIL"] = "email";
    BlacklistType["SPAM"] = "spam";
})(BlacklistType || (exports.BlacklistType = BlacklistType = {}));
//# sourceMappingURL=Blacklist.js.map