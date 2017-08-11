# Common Pdf


CommonPdf wraps a small subset of command line pdf utilities [ **pdftk**, **PoDoFo** ] aiming to provide performant pdf operations in node.js applications.
Though not necessary CommonPdf assumes execution in AWS Lambda. Instructions for setup are described below.

example AWS Lambda usage [CommonPdf Example](https://github.com/corymickelson/CommonPdf-Example)

## API

- concat
- fillform (Pdftk only)
- rotate
- stamp
- digital signing

## Getting Started
All required binaries are provided in the bin directory (binaries are for linux). You may use what is provided
or install separately.

Self Install:
- Install [pdftk](https://www.pdflabs.com/tools/pdftk-server/) and put on your $PATH
- Install [PoDoFo](http://podofo.sourceforge.net/download) and place on your $PATH

Or use CommonPdf.setup (AWS Lambda Only!)

```javascript 
import {setup} from "commonpdf"
setup() 
```
Install CommonPdf

- Install CommonPdf `npm i -S commonpdf`
- Test pdftk & CommonPdf installation ```npm test```
- Import only what you need
```javascript 
const Rotate = require( 'commonpdf' ).Rotate,
    Concat = require( 'commonpdf' ).Concat,
    FillForm = require( 'commonpdf' ).FillForm,
    Stamp = require( 'commonpdf' ).Stamp
```
## Basic Usage
All classes expose a ```write()``` method, and every write returns a promise. The resolved promise will contain
the file path to the newly written file.

File names can either be passed in as an optional parameter or if undefined a unique name will be generated.
This is done to avoid name conflicts in AWS Lambda (files 
written to /tmp may persist across multiple function invocations).

<span style="background-color:#FFFF00">Documentation is currently vague and incomplete. Until this has been remedied (better docs is my current milestone)
exploring the .spec.js files in the /src directory will provide working examples that you may follow.</span>


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

#### Signing:
CommonPdf Sign creates a non-visible (no image yet) digital signature. Signing is performed with PoDoFo,
Signing requires a cert and key is provided. To create your own self signed x509:
1. `openssl genrsa -out ca.key 4096`
2. `openssl req -new -x509 -days 1826 -key ca.key -out ca.crt`
3. ~~openssl pkcs12 -export -out certificate.pfx -inkey privateKey.key -in certificate.crt~~

Click [here](https://blog.didierstevens.com/2008/12/30/howto-make-your-own-cert-with-openssl/) for further information 
on creating your own certificate.



## Todo
 - swap pdftk with podofo
 - improve README
 - better error handling, human readable error messages
 - when digitally signing a document, add option to pass in password to prevent invalidating previous signature
     - with pdftk `pdftk in.pdf output out.pdf owner_pw PASSWORD-HERE`
     - with qpdf `qpdf --password=PASSWORD-HERE --decrypt in.pdf out.pdf`

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

The entry point to the lambda function, `index.ts`, alters the `PATH` and `LD_LIBRARY_PATH` environment variables to let the system know where to find the binary and the GCJ dependency.

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
## Building PoDoFo for AWS Linux(Centos7)

install deps:
sudo yum update
sudo yum install openssl-devel libidn-devel libjpeg-turbo-devel libtiff-devel libpng-devel lua-devel freetype-devel fontconfig-devel cppunit-devel wget clang
Build cmake from source. The current latest version of cmake on centos(and amazon linux) is 2.8


