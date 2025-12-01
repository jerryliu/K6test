"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitsController = void 0;
const common_1 = require("@nestjs/common");
var shell = require('shelljs');
let MonitsController = class MonitsController {
    findAll() {
        const { stdout, stderr, code } = shell.exec('./K6/app.sh');
        console.log('stdout', stdout);
        console.log('stderr', stderr);
        console.log('code', code);
        return 'K6 testing media server';
    }
};
__decorate([
    (0, common_1.Get)(''),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], MonitsController.prototype, "findAll", null);
MonitsController = __decorate([
    (0, common_1.Controller)('monits')
], MonitsController);
exports.MonitsController = MonitsController;
//# sourceMappingURL=monits.controller.js.map