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
class Rotate {
    constructor(source, target, opts, outfile) {
        this.source = source;
        this.target = target;
        this.out = (outfile && outfile.substr(0, 4) === '/tmp') ? outfile : `/tmp/${outfile || uuid_1.v4()}.pdf`;
        this.direction = opts.direction || 'north';
    }
    /**
     *
     * @param {Number} target - target page
     * @returns {Promise<String>} - a substring of the rotation command
     * @private
     */
    _cat(target) {
        return new Promise((fulfill, reject) => __awaiter(this, void 0, void 0, function* () {
            const pageCount = yield new Promise((fulfill, reject) => {
                let command = `pdftk ${this.source} dump_data | grep -i NumberOfPages`;
                child_process_1.exec(command, (error, stdin, stderr) => {
                    if (error || stderr)
                        reject(error);
                    fulfill(parseInt(stdin.substr(stdin.indexOf(':') + 2), stdin.indexOf('\n')));
                });
            });
            if (target === 1 && pageCount === 1)
                fulfill(`1${this.direction}`);
            if (target === 1 && pageCount > 1)
                fulfill(`1${this.direction} 2-end`);
            if (pageCount < target)
                reject('page out of bounds');
            if (target === pageCount)
                fulfill(`1-${target - 1} ${target}${this.direction}`);
            else
                fulfill(`1-${target - 1} ${target}${this.direction} ${target + 1}-end`);
        }));
    }
    /**
     *
     * @returns {Promise<String>} - output pdf path
     */
    write() {
        return new Promise((fulfill, reject) => {
            this._cat(this.target)
                .then(x => {
                let command = `pdftk ${this.source} cat ${x} output ${this.out} `;
                child_process_1.exec(command, (error, stdin, stderr) => {
                    if (error || stderr)
                        reject(error);
                    else
                        fulfill(this.out);
                });
            });
        });
    }
}
exports.Rotate = Rotate;
//# sourceMappingURL=rotate.js.map