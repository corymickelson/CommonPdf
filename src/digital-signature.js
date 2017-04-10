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
const path_1 = require("path");
var DigitalSignatureOption;
(function (DigitalSignatureOption) {
    DigitalSignatureOption[DigitalSignatureOption["Post"] = 0] = "Post";
    DigitalSignatureOption[DigitalSignatureOption["Inline"] = 1] = "Inline";
})(DigitalSignatureOption = exports.DigitalSignatureOption || (exports.DigitalSignatureOption = {}));
/**
 * @desc Secure Pdf with digital signature.
 *      This class uses PortableSigner and requires java is installed on your path
 *
 *      FilePaths must be absolute.
 */
class DigitalSignature {
    constructor(pdf, cert, signOpts, outfile) {
        this.pdf = pdf;
        this.cert = cert;
        this.signOpts = signOpts;
        this.outfile = outfile;
    }
    write() {
        return __awaiter(this, void 0, void 0, function* () {
            let executable = `java -jar PortableSigner.jar -n`, desc = `-l '${this.signOpts.location}' -r '${this.signOpts.reason}'`, command = `${executable} -t ${this.pdf} -o ${this.outfile} -s ${this.cert} -p ${this.signOpts.passwd} ${desc}`, execCommand = `cd ${path_1.join(__dirname, '../bin')} && ${command}`;
            yield new Promise((resolve, reject) => {
                child_process_1.exec(execCommand, (err, stderr, stdout) => {
                    err ? reject(err) : resolve(stdout);
                });
            });
            return this.outfile;
        });
    }
}
exports.DigitalSignature = DigitalSignature;
function future(fn, args) {
    return new Promise((resolve, reject) => {
        try {
            let result = fn.apply(this, args);
            resolve(result);
        }
        catch (e) {
            reject(e);
        }
    });
}
exports.future = future;
//# sourceMappingURL=digital-signature.js.map