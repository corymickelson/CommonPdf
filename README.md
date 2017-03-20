# Common Pdf


CommonPdf wraps a small subset of **pdftk** aiming to provide performant pdf operations in node.js applications.
Though not necessary CommonPdf assumes execution in AWS Lambda. Instructions for setup are described below.


## API

- concat
- fillform
- rotate
- stamp

## Getting Started
- Install [pdftk](https://www.pdflabs.com/tools/pdftk-server/) and put on your path
- Install CommonPdf `npm i -S commonpdf`
- Import only what you need
```javascript 
const Rotate = require( 'commonpdf' ).Rotate,
    Concat = require( 'commonpdf' ).Concat,
    FillForm = require( 'commonpdf' ).FillForm,
    Stamp = require( 'commonpdf' ).Stamp
```
## Basic Usage
All classes expose a write() method. The write methods returns a promise.
The promise contains the path to the newly written file.
All classes also accept an output file parameter. If this is undefined the output 
will be a unique GUID filename. This is done to avoid name conflicts in AWS Lambda (files 
written to /tmp may persist across multiple function invocations).


#### Concat:
Concat accepts an array of pdf file paths. Concat can also be used to split a document. Given a single Pdf input
 define optional parameter ```Array<{start:number, end:number|string}>``` 
```javascript
const Concat = require( 'commonpdf' ).Concat,
    pdfs = ['fileA.pdf', 'fileB.pdf'],
    opts = '/outfile.pdf' 
new Concat(pdfs, opts /*optional*/)
    .write()
    .then(outfilePath => {
    	// do something 
    })
```

#### FillForm:
FillForm requires FdfGenerator, this class will be briefly covered here, for more info look at fdf-generator.spec
```javascript
const FillForm = require('commonpdf').FillForm,
    FdfGenerator = require('commonpdf').FDFGenerator,
    fdfParameters = [
    	{fieldname:'hierarchical field name', fieldvalue:'a string value'},
    	{fieldname:'abutton', fieldvalue:true/false}
    ],
    pdfFilePath = '/path/to/target.pdf'

const fdf = new FdfGenerator(pdfFilePath, fdfParameters)

fdf.write()
    .then(fdfFile => {
    	return new FillForm(fdfFile, pdfFilePath).write()
    })
    .then(outFilePath => {
    	// do something will filled pdf form
    })
```
#### Stamp:
```javascript
const Stamp = require('commonpdf').Stamp,
    img = 'data:image/png;base64,.....',
    pdf = 'path/to/pdf',
    pageNumber = 1,
    dimensions = {width:100, height:100, x:100, y:100}
 
new Stamp(pdf).write(img, pageNumber, dimensions)    
    .then(outfile => {
    	// do something with newly stamped pdf 
    })
```

#### Rotate:
```javascript
const Rotate = require('commonpdf').Rotate,
    pdf = 'pdf/file/path',
    pageNumber = 2,
    config = {direction:'east'}
    
new Rotate(pdf, pageNumber, config)
    .write()
    .then(outfile => {
    	// do something
    })

```

## Todo
 - ~~pdf view portal (web component)~~ Moved to separate repo (CommonPdfComponent)
 - ~~code documentation~~ Added typescript definition file
 - contributor details
 - ~~expand tested pdf's~~ Added test-data directory for unit testing
 - add complete list of command line parameter options
 - add options documentation
 - improve README
## Run as Lambda

Create a zip with

```
./dist.sh
```

Then, simply upload this ZIP to AWS Lambda

## How it Works
AWS Lambda supports binary dependencies by allowing them to be included in uploaded ZIP files. However, because Amazon Linux does not support PDFtk or GCJ, PDFtk was built from source in CentOS, a close relative of Amazon Linux. I spun up a CentOS 6 machine in EC2 and followed the instructions on the [PDFtk website](https://www.pdflabs.com/docs/install-pdftk-on-redhat-or-centos/) to build PDFtk from source. 

```
sudo yum install gcc gcc-java libgcj libgcj-devel gcc-c++

wget https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/pdftk-2.02-src.zip

unzip pdftk-2.02-src.zip

cd pdftk-2.02-dist/pdftk

make -f Makefile.Redhat

sudo make -f Makefile.Redhat install
```

Then I copied the resulting `pdftk` binary and `/usr/lib64/libgcj.so.10` shared library into the `bin/` directory of my Lambda project.

The entry point to the lambda function, `index.js`, alters the `PATH` and `LD_LIBRARY_PATH` environment variables to let the system know where to find the binary and the GCJ dependency.

## Using PDFtk in Amazon Linux

It should be possible to use the PDFtk binary and GCJ shared library located in the `bin/` directory of this file to run PDFtk in Amazon Linux on EC2. Simply copy them onto the machine and put them in the correct path, or call them directly:

```
LD_LIBRARY_PATH=/path/to/libgcj.so.10 /path/to/pdftk --version
```

```javascript 
let exec = require('child_process').exec;

// Set the PATH and LD_LIBRARY_PATH environment variables.
process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'] + '/bin';
process.env['LD_LIBRARY_PATH'] = process.env['LAMBDA_TASK_ROOT'] + '/bin';

exports.handler = function handler (event, context) {
	exec('pdftk --version', context.done);
};
```

