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
/**
 * Created by skyslope on 4/7/17.
 */
function wrap(command) {
    return new Promise((fulfill, reject) => {
        child_process_1.exec(command, (err, stderr, stdout) => {
            err ? reject(err) : fulfill(stdout);
        });
    });
}
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        Promise.all([])
            .then(_ => {
            process.env['PATH'] = `${process.env['PATH']}:${process.env['LAMBDA_TASK_ROOT']}/bin:${process.env['LAMBDA_TASK_ROOT']}/node_modules/commonpdf/bin`;
            process.env['LD_LIBRARY_PATH'] = `${process.env['LAMBDA_TASK_ROOT']}/bin:${process.env['LAMBDA_TASK_ROOT']}/node_modules/commonpdf/bin`;
        })
            .catch(e => {
            throw e;
        });
    });
}
exports.setup = setup;
//# sourceMappingURL=setup.js.map