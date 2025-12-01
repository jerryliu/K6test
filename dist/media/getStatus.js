"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatus = exports.options = void 0;
const k6_1 = require("k6");
const http_1 = require("k6/http");
exports.options = {
    vus: 50,
    duration: '10s',
};
function getStatus() {
    const res = http_1.default.get('https://test-api.k6.io');
    (0, k6_1.check)(res, {
        'status is 200': () => res.status === 200,
    });
    return 'hi';
}
exports.getStatus = getStatus;
//# sourceMappingURL=getStatus.js.map