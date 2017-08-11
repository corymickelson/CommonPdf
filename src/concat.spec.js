/**
 * Created by cory on 1/13/17.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("tape");
const path_1 = require("path");
const child_process_1 = require("child_process");
const concat_1 = require("./concat");
const assert = require("assert");
const fs_1 = require("fs");
test('Concat', t => {
    let output;
    new concat_1.Concat([
        path_1.join(__dirname, '../node_modules/commonpdf_testfiles/IntelliJIDEA_ReferenceCard.pdf'),
        path_1.join(__dirname, '../node_modules/commonpdf_testfiles/de542.pdf'),
        path_1.join(__dirname, '../node_modules/commonpdf_testfiles/fw9.pdf')
    ])
        .write()
        .then(outFile => {
        output = outFile;
        return new Promise((fulfill, reject) => {
            child_process_1.exec(`pdftk ${outFile} dump_data | grep -i NumberOfPages`, (error, stdin, stderr) => {
                if (error || stderr)
                    t.fail();
                else {
                    t.equal(stdin[stdin.indexOf(':') + 2], '8');
                    fulfill();
                }
            });
        });
    })
        .then(_ => {
        fs_1.unlink(output, err => {
            if (err)
                console.error(err);
            t.end();
        });
    })
        .catch(e => {
        t.fail();
    });
});
test('Split', t => {
    let output;
    new concat_1.Concat([path_1.join(__dirname, '../node_modules/commonpdf_testfiles/fw9.pdf')], [{
            start: 1,
            end: 2
        }, {
            start: 4,
            end: 'end'
        }])
        .write()
        .then(outFile => {
        t.plan(1);
        output = outFile;
        return new Promise((fulfill, reject) => {
            child_process_1.exec(`pdftk ${outFile} dump_data | grep -i NumberOfPages`, (error, stdin, stderr) => {
                if (error || stderr)
                    t.fail();
                else {
                    t.equal(stdin[stdin.indexOf(':') + 2], '3');
                    fulfill();
                }
            });
        });
    })
        .then(_ => {
        fs_1.unlink(output, err => {
            if (err)
                console.error(err);
            t.end();
        });
    })
        .catch(e => {
        t.fail();
    });
});
test('Split 1-1', t => {
    let output;
    new concat_1.Concat([path_1.join(__dirname, '../node_modules/commonpdf_testfiles/fw9.pdf')], [{
            start: 1,
            end: 1
        }, {
            start: 4,
            end: 'end'
        }])
        .write()
        .then(outFile => {
        output = outFile;
        t.plan(1);
        return new Promise((fulfill, reject) => {
            child_process_1.exec(`pdftk ${outFile} dump_data | grep -i NumberOfPages`, (error, stdin, stderr) => {
                if (error || stderr)
                    t.fail();
                else {
                    t.equal(stdin[stdin.indexOf(':') + 2], '2');
                    fulfill();
                }
            });
        });
    })
        .then(_ => {
        fs_1.unlink(output, err => {
            if (err)
                console.error(err);
            t.end();
        });
    })
        .catch(e => {
        t.fail();
    });
});
test('Concat and split', t => {
    t.equal(assert.throws(() => {
        new concat_1.Concat([path_1.join(__dirname, '../node_modules/commonpdf_testfiles/fw9.pdf'), path_1.join(__dirname, '../node_modules/commonpdf_testfiles/de542.pdf')], [{
                start: 1,
                end: 1
            }, {
                start: 4,
                end: 'end'
            }]);
    }), undefined, 'Constructor can throw on invalid parameters.');
    t.end();
});
test('Concat with password. Given a signed document, and the signed documents certificate password, Concat will return' +
    'the modified document with a valid certificate', t => {
    let certifiedPdf = path_1.join(__dirname, '../node_modules/commonpdf_testfiles/fw9.signed.pdf'), concatOpts = [{ start: 1, end: 1 }, { start: 4, end: 'end' }], signOpts = {
        reason: 'SkySlope',
        cert: path_1.join(__dirname, '../node_modules/commonpdf_testfiles/ca.cert'),
        key: path_1.join(__dirname, '../node_modules/commonpdf_testfiles/ca.key')
        /*			encrypt: DigitalSignatureOption.Inline,
                    config: { options: { passwd: '123456' } }*/
    }, output;
    new concat_1.Concat([certifiedPdf], concatOpts, signOpts)
        .write()
        .then(out => {
        output = out;
        return fs_1.exists(out, exists => {
            t.true(exists);
        });
    })
        .then(_ => {
        fs_1.unlink(output, err => {
            if (err)
                console.error(err);
            t.end();
        });
    });
});
test('Concat optional post process digital signature returns a newly signed document.', t => {
    let unsignedPdf = path_1.join(__dirname, '../node_modules/commonpdf_testfiles/fw9.pdf'), concatOpts = [{ start: 1, end: 1 }, { start: 4, end: 'end' }], signOpts = {
        reason: 'SkySlope',
        cert: path_1.join(__dirname, '../node_modules/commonpdf_testfiles/ca.cert'),
        key: path_1.join(__dirname, '../node_modules/commonpdf_testfiles/ca.key')
    }, output;
    new concat_1.Concat([unsignedPdf], concatOpts, signOpts)
        .write()
        .then(out => {
        output = out;
        return fs_1.exists(out, exists => {
            t.true(exists);
        });
    })
        .then(_ => {
        Promise.all([fs_1.unlink(`${output.substr(0, output.length - 4)}.unsigned.pdf`, err => {
                return new Promise((fulfill, reject) => {
                    err ? reject(err) : fulfill();
                });
            }),
            fs_1.unlink(output, err => {
                return new Promise((fulfill, reject) => {
                    err ? reject(err) : fulfill();
                });
            })])
            .then(_ => {
            t.end();
        });
    })
        .catch(e => t.end(e));
});
//# sourceMappingURL=concat.spec.js.map