"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const digital_signature_1 = require("./digital-signature");
const test = require("tape");
const path_1 = require("path");
/**
 * Created by skyslope on 4/6/17.
 */
process.env.SPEC = true;
test('Digital signature', t => {
    t.plan(1);
    let outfile = '/tmp/digitalSignatureSpec.pdf';
    const Subject = new digital_signature_1.DigitalSignature(path_1.join(__dirname, '../test-data/fw9.pdf'), path_1.join(__dirname, '../test-data/test-cert.pfx'), {
        location: '123 someplace ln.',
        reason: 'Test',
        passwd: '123456'
    }, outfile);
    Subject.write()
        .then((x) => {
        return fs_1.exists(x, exists => {
            t.true(exists);
        });
    })
        .then(() => {
        fs_1.unlink(outfile, (err) => {
            if (err)
                console.log('failed to clean up test file');
        });
    });
});
//# sourceMappingURL=digital-signature.spec.js.map