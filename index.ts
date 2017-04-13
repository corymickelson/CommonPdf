'use strict'

import { Concat as concat } from './src/concat'
import { FillForm as fillForm } from './src/fillform'
import {
	FDFGenerator as generator,
	PdfData as parseData
} from './src/fdf-generator'
import { DigitalSignature as ds, DigitalSignatureOption as dsOpts } from './src/digital-signature'
import { setup as binaryPath } from './src/setup'
import { Fix as fix } from './src/fix'
import { Rotate as rotate } from './src/rotate'
import { Stamp as stamp } from './src/stamp'

export const Concat = concat,
	FillForm = fillForm,
	FDFGenerator = generator,
	PdfData = parseData,
	DigitalSignature = ds,
	setup = binaryPath,
	Fix = fix,
	DigitalSignatureOption = dsOpts,
	Rotate = rotate

export type FilePath = string

