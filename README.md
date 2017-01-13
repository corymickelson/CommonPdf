# Common Pdf


***
warning very early stages, not for production use.
***

CommonPdf wraps a small subset of **pdftk** aiming to provide performant pdf operations in node.js applications.

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
        Stamp = requir( 'commonpdf' ).Stamp
```
## Basic Usage
Concat:
 
Simply takes and array of pdf's (file paths) and combines them together into a single pdf. The resulting pdf
will be in the same order as the input array. 
Concat exposes a single method `write()`. Concat.write() returns a promise passing the array of pdf file paths to 
`pdftk concat`.
```javascript
const Concat = require( 'commonpdf' ).Concat,
    pdfs = ['fileA.pdf', 'fileB.pdf']
   
new Concat(pdfs)
    .write()
    .then(outfilePath => {
    	// do something 
    })
```

FillForm:

Stamp:

Rotate:


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

