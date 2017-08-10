'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("tape");
const fdf_generator_1 = require("./fdf-generator");
const fillform_1 = require("./fillform");
const pdfFile = '../test-data/fw9.pdf';
test('Name, Business Name, S Corp, and Partnership', t => {
    const fieldValues = [
        {
            fieldname: "topmostSubform[0].Page1[0].f1_1[0]",
            fieldvalue: "test"
        },
        {
            fieldname: "topmostSubform[0].Page1[0].f1_2[0]",
            fieldvalue: "skyslope"
        },
        {
            fieldname: 'topmostSubform[0].Page1[0].FederalClassification[0].c1_1[2]',
            fieldvalue: true
        },
        {
            fieldname: 'topmostSubform[0].Page1[0].FederalClassification[0].c1_1[3]',
            fieldvalue: true
        }
    ], FDFGenerator = new fdf_generator_1.FDFGenerator(pdfFile, fieldValues);
    FDFGenerator.write()
        .then(fdf => {
        let fillForm = new fillform_1.FillForm(fdf, pdfFile);
        return fillForm.write();
    })
        .then(pdf => {
        return fdf_generator_1.PdfData(pdf);
    })
        .then(data => {
        t.plan(fieldValues.length);
        fieldValues.map(v => {
            let field = data.find(x => x['FieldName'] === v.fieldname);
            if (typeof v.fieldvalue === 'boolean') {
                if (v.fieldvalue)
                    t.equal(field['FieldValue'], field['FieldStateOption']);
                else
                    t.equal(field['FieldValue'], 0);
            }
            else
                t.equal(field['FieldValue'], v.fieldvalue);
        });
    });
});
test('Name, Business Name, S Corp, and Partnership, flatten', t => {
    const fieldValues = [
        {
            fieldname: "topmostSubform[0].Page1[0].f1_1[0]",
            fieldvalue: "test"
        },
        {
            fieldname: "topmostSubform[0].Page1[0].f1_2[0]",
            fieldvalue: "skyslope"
        },
        {
            fieldname: 'topmostSubform[0].Page1[0].FederalClassification[0].c1_1[2]',
            fieldvalue: true
        },
        {
            fieldname: 'topmostSubform[0].Page1[0].FederalClassification[0].c1_1[3]',
            fieldvalue: true
        }
    ], FDFGenerator = new fdf_generator_1.FDFGenerator(pdfFile, fieldValues);
    FDFGenerator.write()
        .then(fdf => {
        let fillForm = new fillform_1.FillForm(fdf, pdfFile, ['flatten']);
        return fillForm.write();
    })
        .then(pdf => {
        t.ok(pdf);
        return fdf_generator_1.PdfData(pdf);
    })
        .then(data => {
        t.equal(data, null);
        t.end();
    })
        .catch(e => t.end(e));
});
//# sourceMappingURL=fillform.spec.js.map