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
const path_1 = require("path");
const fs_1 = require("fs");
const uuid_1 = require("uuid");
const child_process_1 = require("child_process");
class FDFGenerator {
    constructor(pdf, values) {
        this.values = values;
        this.header = '%FDF-1.2\n 1 0 obj<</FDF<< /Fields[';
        this.footer = '] >> >>\n endobj\n trailer\n <</Root 1 0 R>>\n %%EOF';
        FDFGenerator._constructorValidations(pdf, values);
        this.pdf = pdf.substr(0, 4) === '/tmp' ? pdf : path_1.join(__dirname, pdf);
        this.values = values;
        this.out = `/tmp/${uuid_1.v4()}.fdf`;
    }
    static _constructorValidations(pdf, values) {
        if (typeof pdf !== 'string' || !Array.isArray(values))
            throw new TypeError();
        if (!fs_1.existsSync(pdf.substr(0, 4) === '/tmp' ? pdf : path_1.join(__dirname, pdf))) {
            throw new Error('pdf file not found');
        }
        if (!values) {
            throw new Error('values must not be null');
        }
    }
    write() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let searchUtil = yield this._checkAg();
                this.grep = searchUtil ? 'ag' : 'grep';
                this.pdfData = yield this._validate();
                let body = this._assignments(this.values);
                return yield this._write(body);
            }
            catch (e) {
                throw e;
            }
        });
    }
    _validate() {
        return __awaiter(this, void 0, void 0, function* () {
            let titles = yield FDFGenerator._extractFieldNames(this.pdf);
            if (!this.values.every(v => titles.find(t => t.FieldName === v.fieldname) !== undefined)) {
                throw new Error('mismatched field name mapping');
            }
            else
                return titles;
        });
    }
    _write(fdfMap) {
        let lines = [this.header, ...fdfMap.map(f => FDFGenerator._fieldWriter(f)), this.footer].join('\n');
        return new Promise((fulfill, reject) => {
            fs_1.writeFile(this.out, lines, { encoding: 'utf8' }, (err) => {
                err ? reject(err) : fulfill(this.out);
            });
        });
    }
    static _fieldWriter(field) {
        return `<< /T (${field.fieldname}) /V (${field.fieldvalue}) >>`;
    }
    _checkAg() {
        return new Promise(fulfill => {
            child_process_1.exec('ag -h', (error, stdout, stderr) => {
                if (error || stderr)
                    fulfill(false);
                else
                    fulfill(true);
            });
        });
    }
    static _extractFieldNames(pdf) {
        return new Promise((fulfill, reject) => {
            child_process_1.exec(`pdftk ${pdf} dump_data_fields`, (err, stdout, stderr) => {
                if (err)
                    reject(err);
                if (stdout === '')
                    fulfill(null);
                fulfill(stdout.split('---')
                    .filter(i => i.length > 3)
                    .reduce((accum, item, index) => {
                    let field = {}, line = item.split('\n')
                        .filter(i => i.length > 1), name = line.map(i => i.substr(0, i.indexOf(':'))), value = line.map(i => i.substr(i.indexOf(':') + 2));
                    name.forEach((p, i) => {
                        if (!field.hasOwnProperty(p))
                            field[p] = value[i];
                    });
                    if (field['FieldType'].trim().length === 0)
                        return accum;
                    else {
                        accum.push(field);
                        return accum;
                    }
                }, []));
            });
        });
    }
    _assignments(fields) {
        return fields.reduce((accum, field, index) => {
            let dataField = this.pdfData.find(x => x['FieldName'] === field.fieldname), writeValue = field.fieldvalue;
            if (dataField.hasOwnProperty('FieldStateOption')) {
                writeValue = field.fieldvalue ? dataField['FieldStateOption'] : 0;
            }
            return [{ fieldname: dataField['FieldName'], fieldvalue: writeValue }, ...accum];
        }, []);
    }
}
exports.FDFGenerator = FDFGenerator;
exports.PdfData = FDFGenerator._extractFieldNames;
//# sourceMappingURL=fdf-generator.js.map