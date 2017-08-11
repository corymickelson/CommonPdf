/**
 * Created by cory on 1/17/17.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("tape");
const rotate_1 = require("./rotate");
const path_1 = require("path");
const child_process_1 = require("child_process");
test('rotate first page.', t => {
    t.plan(2);
    let source = path_1.join(__dirname, '../node_modules/commonpdf_testfiles/fw9.pdf'), target = 1, opts = { direction: 'east' };
    new rotate_1.Rotate(source, target, opts)
        .write()
        .then(out => {
        let command = `pdftk ${out} dump_data | grep -i PageMediaRotation`;
        child_process_1.exec(command, { shell: '/bin/sh' }, (error, stdin, stderr) => {
            if (error || stderr)
                t.fail();
            const pageData = stdin.split('\n').filter(x => x.length > 0);
            t.equal(4, pageData.length);
            t.equal(parseInt(pageData[0].substr(pageData[0].indexOf(':') + 2)), 90);
        });
    });
});
test('rotate second page.', t => {
    t.plan(4);
    let source = path_1.join(__dirname, '../node_modules/commonpdf_testfiles/fw9.pdf'), target = 2, opts = { direction: 'east' };
    new rotate_1.Rotate(source, target, opts)
        .write()
        .then(out => {
        let command = `pdftk ${out} dump_data | grep -i PageMediaRotation`;
        child_process_1.exec(command, { shell: '/bin/sh' }, (error, stdin, stderr) => {
            if (error || stderr)
                t.fail();
            const pageData = stdin.split('\n').filter(x => x.length > 0);
            t.equal(4, pageData.length);
            t.equal(parseInt(pageData[1].substr(pageData[0].indexOf(':') + 2)), 90);
            t.equal(parseInt(pageData[0].substr(pageData[0].indexOf(':') + 2)), 0);
            t.equal(parseInt(pageData[2].substr(pageData[0].indexOf(':') + 2)), 0);
        });
    });
});
test('rotate last page.', t => {
    t.plan(3);
    let source = path_1.join(__dirname, '../node_modules/commonpdf_testfiles/fw9.pdf'), target = 4, opts = { direction: 'east' };
    new rotate_1.Rotate(source, target, opts)
        .write()
        .then(out => {
        let command = `pdftk ${out} dump_data | grep -i PageMediaRotation`;
        child_process_1.exec(command, { shell: '/bin/sh' }, (error, stdin, stderr) => {
            if (error || stderr)
                t.fail();
            const pageData = stdin.split('\n').filter(x => x.length > 0);
            t.equal(4, pageData.length);
            t.equal(parseInt(pageData[3].substr(pageData[0].indexOf(':') + 2)), 90);
            t.equal(parseInt(pageData[2].substr(pageData[0].indexOf(':') + 2)), 0);
        });
    });
});
test('rotate page one of one', t => {
    t.plan(2);
    let source = path_1.join(__dirname, '../node_modules/commonpdf_testfiles/singlePage.pdf'), target = 1, opts = { direction: 'south' };
    new rotate_1.Rotate(source, target, opts)
        .write()
        .then(out => {
        let command = `pdftk ${out} dump_data | grep -i PageMediaRotation`;
        child_process_1.exec(command, { shell: '/bin/sh' }, (error, stdin, stderr) => {
            if (error || stderr)
                t.fail();
            const pageData = stdin.split('\n').filter(x => x.length > 0);
            t.equal(1, pageData.length);
            t.equal(parseInt(pageData[0].substr(pageData[0].indexOf(':') + 2)), 180);
        });
    });
});
//# sourceMappingURL=rotate.spec.js.map