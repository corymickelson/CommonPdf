# Common Pdf


***
warning very early stages, not for production use.
***

CommonPdf aims to provide performant pdf operations using pdftk, pdfjam, and imagemagik
## API

This module exposes multiple endpoints wrapping various pdftk commands for use behind AWS api gateway. 

### fill form

### stamp

Signature  stamping requires pdfkit, and pdf2json to position the signature image properly. 
The pdf to stamp should have placeholder text areas, which will be parsed for there height, width, x, and y 
coordinates. The image will be sized and placed according the this output, and rendered as a new pdf on a transparent b
background. Finally the base pdf and the newly created pdf will be "stamped" to create a single new pdf
### concat

### rotate

## Run as Lambda

Create a zip with

```
./dist.sh
```

Then, simply upload this ZIP to AWS Lambda

## How it Works
Requires node.js ^6.9.1.
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

A pdftk wrapper for node.js, this project requires pdftk on your path. If using within lambda, add the following to the top of
your index.js file. 
```javascript
process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'] + '/bin';
process.env['LD_LIBRARY_PATH'] = process.env['LAMBDA_TASK_ROOT'] + '/bin';
```
