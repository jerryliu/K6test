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
exports.MediaController = void 0;
const common_1 = require("@nestjs/common");
const media_service_1 = require("./media.service");
const shell = require('shelljs');
let MediaController = class MediaController {
    constructor(mediaService) {
        this.mediaService = mediaService;
    }
    async getItems() {
        return await this.mediaService.getItems();
        return 'K6 testing media server';
    }
    getItemsByIdListApk() {
        this.mediaService.getItemsByIdListApk();
        return 'K6 testing media server';
    }
    getSingleItem() {
        this.mediaService.getSingleItem();
        return 'K6 testing media server';
    }
    getMultiSignedUrl() {
        this.mediaService.getMultiSignedUrl();
        return 'K6 testing media server';
    }
    async uploadImageSmokeTest() {
        return await this.mediaService.uploadImageSmokeTest();
    }
};
__decorate([
    (0, common_1.Get)('getItems'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getItems", null);
__decorate([
    (0, common_1.Get)('getItemsByIdListApk'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], MediaController.prototype, "getItemsByIdListApk", null);
__decorate([
    (0, common_1.Get)('getSingleItem'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], MediaController.prototype, "getSingleItem", null);
__decorate([
    (0, common_1.Get)('getMultiSignedUrl'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], MediaController.prototype, "getMultiSignedUrl", null);
__decorate([
    (0, common_1.Get)('uploadImageSmokeTest'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadImageSmokeTest", null);
MediaController = __decorate([
    (0, common_1.Controller)('monit/media'),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], MediaController);
exports.MediaController = MediaController;
//# sourceMappingURL=media.controller.js.map