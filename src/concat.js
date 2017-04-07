/**
 * Created by cory on 12/29/16.
 */
'use strict';
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
const fs = require("fs");
var DigitalSignatureOption;
(function (DigitalSignatureOption) {
    DigitalSignatureOption[DigitalSignatureOption["Post"] = 0] = "Post";
    DigitalSignatureOption[DigitalSignatureOption["Inline"] = 1] = "Inline";
})(DigitalSignatureOption = exports.DigitalSignatureOption || (exports.DigitalSignatureOption = {}));
class Concat {
    constructor(docs, options, signOpts, outfile) {
        this.docs = docs;
        this.options = options;
        this.signOpts = signOpts;
        this.signInline = false;
        this.postProcessSigning = false;
        this.docs = docs.map(doc => {
            if (!fs.existsSync(doc))
                throw new Error(`File not found ${doc}`);
            return doc;
        });
        if (Array.isArray(options) && options.length > 0) {
            this.options = options.reduce((accum, item, index) => {
                accum.push([`${item.start}${!item.end ? '' : '-'}${item.end || ''}`]);
                return accum;
            }, []);
        }
        else
            this.options = [];
        if (this.docs.length > 1 && this.options.length > 0)
            throw new Error('Can not concat and split. Try, concatenating first, and splitting afterwards.');
        this.out = (outfile && outfile.substr(0, 4) === '/tmp') ? outfile : `/tmp/${outfile || uuid_1.v4()}.pdf`;
        if (signOpts) {
            if (signOpts.encrypt === DigitalSignatureOption.Inline) {
                this.password = signOpts.config.options.passwd;
            }
            else {
            }
        }
    }
    write() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((fulfill, reject) => {
                let secure = this.signInline ? `owner_pw ${this.password}` : '', command = `pdftk ${this.docs.join(' ')} cat ${this.options.join(" ")} output ${this.out} ${secure}`;
                child_process_1.exec(command, { shell: '/bin/sh' }, (error, stdout, stderr) => {
                    error || stderr ? reject(error) : fulfill(this.out);
                });
            });
            if (this.postProcessSigning) {
            }
            else
                return this.out;
        });
    }
}
module.exports.Concat = Concat;
//# sourceMappingURL=concat.js.map