'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const concat_1 = require("./src/concat");
const fillform_1 = require("./src/fillform");
const fdf_generator_1 = require("./src/fdf-generator");
const digital_signature_1 = require("./src/digital-signature");
const setup_1 = require("./src/setup");
const fix_1 = require("./src/fix");
exports.Concat = concat_1.Concat, exports.FillForm = fillform_1.FillForm, exports.FDFGenerator = fdf_generator_1.FDFGenerator, exports.PdfData = fdf_generator_1.PdfData, exports.DigitalSignature = digital_signature_1.DigitalSignature, exports.setup = setup_1.setup, exports.Fix = fix_1.Fix;
/**
 *
 * @type {Rotate}
 */
module.exports.Rotate = require('./src/rotate').Rotate;
/**
 *
 * @type {Stamp}
 */
module.exports.Stamp = require('./src/stamp').Stamp;
//# sourceMappingURL=index.js.map