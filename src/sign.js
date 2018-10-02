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
const child_process_1 = require("child_process");
const uuid_1 = require("uuid");
class Sign {
    constructor(pdf, cert, key, opt, out) {
        this.pdf = pdf;
        this.cert = cert;
        this.key = key;
        this.opt = opt;
        this.out = out;
        this.commandOpts = '';
        if (this.out == null) {
            this.out = `/tmp/${uuid_1.v4()}.pdf`;
        }
        if (this.opt) {
            if (this.opt.fieldName)
                this.commandOpts += ` -field-name ${this.opt.fieldName}`;
            if (this.opt.password)
                this.commandOpts += ` -password ${this.opt.password}`;
            if (this.opt.reason)
                this.commandOpts += ` -reason "${this.opt.reason}"`;
            if (this.opt.useExistingSignatureField)
                this.commandOpts += ' -field-use-existing';
        }
    }
    write() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((fulfill, reject) => {
                const command = `podofosign -in ${this.pdf} -cert ${this.cert} -pkey ${this.key} -out ${this.out}`;
                child_process_1.exec(`${command}${this.commandOpts}`, (e, stdout, stderr) => {
                    e ? reject(stderr) : fulfill(this.out);
                });
            });
        });
    }
}
exports.Sign = Sign;
//# sourceMappingURL=sign.js.map