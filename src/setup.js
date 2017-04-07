/**
 * Created by skyslope on 4/7/17.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setup() {
    process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'] + '/bin';
    process.env['LD_LIBRARY_PATH'] = process.env['LAMBDA_TASK_ROOT'] + '/bin';
}
exports.setup = setup;
//# sourceMappingURL=setup.js.map