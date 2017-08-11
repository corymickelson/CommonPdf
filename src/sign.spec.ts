import {join} from 'path'
import {existsSync, unlink} from 'fs'
import * as test from 'tape'
import {Sign} from './sign'
import {FieldAnnotations, PdfData} from './fdf-generator'

test('Digital Signature (PoDoFo)', async t => {
    const signer = new Sign(
        join(__dirname, '../node_modules/commonpdf_testfiles/de542.pdf'),
        join(__dirname, '../node_modules/commonpdf_testfiles/ca.cert'),
        join(__dirname, '../node_modules/commonpdf_testfiles/ca.key'),
        {reason: 'SkySlope'})

    let output = await signer.write(),
        exists = existsSync(output),
        data:[FieldAnnotations] = await PdfData(output),
        field = data.find(x => x.FieldType === 'Signature')

    t.ok(exists)
    t.ok(field)

    unlink(output, err => {
        if(err) console.error(err)
        t.end()
    })
})