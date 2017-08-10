'use strict'

import {Concat as concat} from './src/concat'
import {FillForm as fillForm} from './src/fillform'
import {FDFGenerator as generator, PdfData as parseData} from './src/fdf-generator'
import {setup as binaryPath} from './src/setup'
import {Fix as fix} from './src/fix'
import {Rotate as rotate} from './src/rotate'
import {Sign as sign} from './src/sign'
import {Stamp as stamp} from './src/stamp'

export const Concat = concat,
	FillForm = fillForm,
	FDFGenerator = generator,
	PdfData = parseData,
	setup = binaryPath,
	Fix = fix,
	Rotate = rotate,
	Sign = sign,
	Stamp = stamp

export type FilePath = string

