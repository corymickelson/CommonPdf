/**
 * Created by cory on 1/13/17.
 */

'use strict'
import * as test from 'tape'
import {join} from 'path'
import {exec} from 'child_process'
import {Concat as Subject} from './concat'
import * as assert from "assert";
import {exists, unlink} from "fs";
import {SignOptions} from "./sign";
import {FilePath} from "../index";


test('Concat', t => {
    let output: string
    new Subject([
        join(__dirname, '../node_modules/commonpdf_testfiles/IntelliJIDEA_ReferenceCard.pdf'),
        join(__dirname, '../node_modules/commonpdf_testfiles/de542.pdf'),
        join(__dirname, '../node_modules/commonpdf_testfiles/fw9.pdf')])
        .write()
        .then(outFile => {
            output = outFile
            return new Promise((fulfill, reject) => {
                exec(`pdftk ${outFile} dump_data | grep -i NumberOfPages`, (error, stdin, stderr) => {
                    if (error || stderr) t.fail()
                    else {
                        t.equal(stdin[stdin.indexOf(':') + 2], '8')
                        fulfill()
                    }
                })
            })
        })
        .then(_ => {
            unlink(output, err => {
                if (err) console.error(err)
                t.end()
            })
        })
        .catch(e => {
            t.fail()
        })
})
test('Split', t => {
    let output: string
    new Subject([join(__dirname, '../node_modules/commonpdf_testfiles/fw9.pdf')], [{
        start: 1,
        end: 2
    }, {
        start: 4,
        end: 'end'
    }],)
        .write()
        .then(outFile => {
            t.plan(1)
            output = outFile
            return new Promise((fulfill, reject) => {
                exec(`pdftk ${outFile} dump_data | grep -i NumberOfPages`, (error, stdin, stderr) => {
                    if (error || stderr) t.fail()
                    else {
                        t.equal(stdin[stdin.indexOf(':') + 2], '3')
                        fulfill()
                    }
                })
            })
        })
        .then(_ => {
            unlink(output, err => {
                if (err) console.error(err)
                t.end()
            })
        })
        .catch(e => {
            t.fail()
        })
})
test('Split 1-1', t => {
    let output: string
    new Subject([join(__dirname, '../node_modules/commonpdf_testfiles/fw9.pdf')], [{
        start: 1,
        end: 1
    }, {
        start: 4,
        end: 'end'
    }])
        .write()
        .then(outFile => {
            output = outFile
            t.plan(1)
            return new Promise((fulfill, reject) => {
                exec(`pdftk ${outFile} dump_data | grep -i NumberOfPages`, (error, stdin, stderr) => {
                    if (error || stderr) t.fail()
                    else {
                        t.equal(stdin[stdin.indexOf(':') + 2], '2')
                        fulfill()
                    }
                })
            })
        })
        .then(_ => {
            unlink(output, err => {
                if (err) console.error(err)
                t.end()
            })
        })
        .catch(e => {
            t.fail()
        })
})
test('Concat and split', t => {
    t.equal(assert.throws(() => {
        new Subject([join(__dirname, '../node_modules/commonpdf_testfiles/fw9.pdf'), join(__dirname, '../node_modules/commonpdf_testfiles/de542.pdf')], [{
            start: 1,
            end: 1
        }, {
            start: 4,
            end: 'end'
        }])
    }), undefined, 'Constructor can throw on invalid parameters.')
    t.end()
})
test('Concat with password. Given a signed document, and the signed documents certificate password, Concat will return' +
    'the modified document with a valid certificate', t => {

    let certifiedPdf = join(__dirname, '../node_modules/commonpdf_testfiles/fw9.signed.pdf'),
        concatOpts = [{start: 1, end: 1}, {start: 4, end: 'end'}],
        signOpts: SignOptions & { cert: FilePath, key: FilePath } = {
            reason: 'SkySlope',
            cert: join(__dirname, '../node_modules/commonpdf_testfiles/ca.cert'),
            key: join(__dirname, '../node_modules/commonpdf_testfiles/ca.key')
            /*			encrypt: DigitalSignatureOption.Inline,
                        config: { options: { passwd: '123456' } }*/
        },
        output: string

    new Subject([certifiedPdf], concatOpts, signOpts)
        .write()
        .then(out => {
            output = out
            return exists(out, exists => {
                t.true(exists)
            })
        })
        .then(_ => {
            unlink(output, err => {
                if (err) console.error(err)
                t.end()
            })
        })
})
test('Concat optional post process digital signature returns a newly signed document.', t => {
    let unsignedPdf = join(__dirname, '../node_modules/commonpdf_testfiles/fw9.pdf'),
        concatOpts = [{start: 1, end: 1}, {start: 4, end: 'end'}],
        signOpts: SignOptions & { cert: FilePath, key: FilePath } = {
            reason: 'SkySlope',
            cert: join(__dirname, '../node_modules/commonpdf_testfiles/ca.cert'),
            key: join(__dirname, '../node_modules/commonpdf_testfiles/ca.key')
        },
        output: string
    new Subject([unsignedPdf], concatOpts, signOpts)
        .write()
        .then(out => {
            output = out
            return exists(out, exists => {
                t.true(exists)
            })
        })
        .then(_ => {
            Promise.all([unlink(`${output.substr(0, output.length - 4)}.unsigned.pdf`, err => {
                return new Promise((fulfill, reject) => {
                    err ? reject(err) : fulfill()
                })
            }),
                unlink(output, err => {
                    return new Promise((fulfill, reject) => {
                        err ? reject(err) : fulfill()
                    })
                })])
                .then(_ => {
                    t.end()
                })

        })
        .catch(e => t.end(e))
})
