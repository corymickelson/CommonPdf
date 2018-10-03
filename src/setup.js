"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setup() {
    const commonPdfPodofo = `${process.env['LAMBDA_TASK_ROOT'] || __dirname}/node_modules/commonpdf_podofo`;
    const commonPdfPdftk = `${process.env['LAMBDA_TASK_ROOT'] || __dirname}/node_modules/commonpdf_pdftk`;
    process.env['PATH'] = `${process.env['PATH']}:${commonPdfPdftk}:${commonPdfPodofo}`;
    process.env['LD_LIBRARY_PATH'] = `${commonPdfPodofo}:${commonPdfPdftk}`;
}
exports.setup = setup;
//# sourceMappingURL=setup.js.map