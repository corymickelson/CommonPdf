"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const path_1 = require("path");
const fs_1 = require("fs");
const child_process_1 = require("child_process");
/**
 * Created by skyslope on 4/12/17.
 */
class Fix {
    constructor(pdf, outfile) {
        this.pdf = pdf;
        Fix._validateConstructor(pdf);
        this.out = (outfile && outfile.substr(0, 4) === '/tmp') ? outfile : `/tmp/${outfile || uuid_1.v4()}.pdf`;
    }
    static _validateConstructor(pdfFilePath) {
        if (!fs_1.existsSync(pdfFilePath.substr(0, 4) === '/tmp' ? pdfFilePath : path_1.join(__dirname, pdfFilePath)))
            throw Error('Pdf file not found');
    }
    write() {
        return new Promise((fulfill, reject) => {
            child_process_1.exec(`pdftk ${this.pdf} output ${this.out}`, (err, stderr, stdout) => {
                err ? reject(err) : fulfill(this.out);
            });
        });
    }
}
exports.Fix = Fix;
//# sourceMappingURL=fix.js.map