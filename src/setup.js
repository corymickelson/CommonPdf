"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
function findCommonPdfBinaries() {
    return __awaiter(this, void 0, void 0, function* () {
        const commonPdfBinaryModules = ['CommonPdf_PoDoFo', 'CommonPdf_Pdftk'], nodeModulesPath = path_1.join(__dirname, '../node_modules');
        if (!fs_1.existsSync(nodeModulesPath)) {
            throw Error('node modules directory not found... please run \`npm install`\ and try again.');
        }
        return new Promise((fulfill, reject) => {
            fs_1.readdir(nodeModulesPath, ((err, files) => {
                if (err)
                    reject(err);
                return commonPdfBinaryModules.every(m => files.includes(m));
            }));
        });
    });
}
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        //const check = await findCommonPdfBinaries()
        //if (!check) throw Error('CommonPdf binaries not found!')
        const commonPdfPodofo = `${process.env['LAMBDA_TASK_ROOT']}/node_modules/commonpdf_podofo`;
        const commonPdfPdftk = `${process.env['LAMBDA_TASK_ROOT']}/node_modules/commonpdf_pdftk`;
        process.env['PATH'] = `${process.env['PATH']}:${commonPdfPdftk}:${commonPdfPodofo}`;
        process.env['LD_LIBRARY_PATH'] = `${commonPdfPodofo}:${commonPdfPdftk}`;
    });
}
exports.setup = setup;
//# sourceMappingURL=setup.js.map