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

export const Concat = concat,
	FillForm = fillForm,
	FDFGenerator = generator,
	PdfData = parseData,
	DigitalSignature = ds,
	setup = binaryPath,
	Fix = fix,
	DigitalSignatureOption = dsOpts

export type FilePath = string

/**
 *
 * @type {Rotate}
 */
module.exports.Rotate = require( './src/rotate' ).Rotate
/**
 *
 * @type {Stamp}
 */
module.exports.Stamp = require( './src/stamp' ).Stamp
