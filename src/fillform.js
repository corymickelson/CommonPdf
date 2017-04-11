'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const child_process_1 = require("child_process");
const uuid_1 = require("uuid");
/**
 * @property {String} out - output file path. This module assums execution in aws lambda environment.
 *      The passed in pdf file should be a unique s3 file name (key). If it is not this file could
 *      potentially be over-written be a subsequent call.
 */
class FillForm {
    constructor(fdfFilePath, pdfFilePath, options = [], outfile) {
        FillForm._validateConstructor(pdfFilePath, options);
        this.fdf = fdfFilePath;
        this.pdf = pdfFilePath.substr(0, 4) === '/tmp' ? pdfFilePath : path_1.join(__dirname, pdfFilePath);
        this.out = `/tmp/${outfile || uuid_1.v4()}.pdf`;
        this.options = options || [];
    }
    static _validateConstructor(pdfFilePath, options) {
        if (!fs_1.existsSync(pdfFilePath.substr(0, 4) === '/tmp' ? pdfFilePath : path_1.join(__dirname, pdfFilePath)))
            throw Error('Pdf file not found');
        if (!Array.isArray(options))
            throw Error("options must be an array");
    }
    write() {
        return new Promise((fulfill, reject) => {
            let command = `pdftk ${this.pdf} fill_form ${this.fdf} output ${this.out} ${this.options.join(" ").toLowerCase()}`;
            child_process_1.exec(command, { shell: '/bin/sh' }, (error, stdout, stderr) => {
                if (error || stderr)
                    reject(error);
                else
                    fulfill(this.out);
            });
        });
    }
}
exports.FillForm = FillForm;
//# sourceMappingURL=fillform.js.map