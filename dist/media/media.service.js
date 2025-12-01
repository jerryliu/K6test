"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
var shell = require('shelljs');
var exec = require('shelljs').exec;
const { spawn } = require('child_process');
const { execFile } = require('child_process');
let MediaService = class MediaService {
    async getItems() {
        await execFile('k6', ['run', './k6/media/getItems.js'], (error, stdout, stderr) => {
            console.log(`stdout-------------: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
    }
    async getItemsByIdListApk() {
    }
    async getSingleItem() {
    }
    async getMultiSignedUrl() {
        execFile('k6', ['run', './k6/media/uploadImageSmokeTest.js'], (error, stdout, stderr) => {
            if (error) {
                console.error(`error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            return stdout;
        });
    }
    async uploadImageSmokeTest() {
        let result;
        await execFile('k6', ['run', './k6/media/uploadImageSmokeTest.js'], (error, stdout, stderr) => {
            console.log(`stdout-------------: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            result = stderr;
        });
    }
};
MediaService = __decorate([
    (0, common_1.Injectable)()
], MediaService);
exports.MediaService = MediaService;
//# sourceMappingURL=media.service.js.map