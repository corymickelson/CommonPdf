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
const test = require("tape");
const sign_1 = require("./sign");
const fdf_generator_1 = require("./fdf-generator");
test('Digital Signature (PoDoFo)', (t) => __awaiter(this, void 0, void 0, function* () {
    const signer = new sign_1.Sign(path_1.join(__dirname, '../node_modules/commonpdf_testfiles/de542.pdf'), path_1.join(__dirname, '../node_modules/commonpdf_testfiles/ca.cert'), path_1.join(__dirname, '../node_modules/commonpdf_testfiles/ca.key'), { reason: 'SkySlope' });
    let output = yield signer.write(), exists = fs_1.existsSync(output), data = yield fdf_generator_1.PdfData(output), field = data.find(x => x.FieldType === 'Signature');
    t.ok(exists);
    t.ok(field);
    fs_1.unlink(output, err => {
        if (err)
            console.error(err);
        t.end();
    });
}));
//# sourceMappingURL=sign.spec.js.map