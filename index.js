'use strict'
/**
 *
 * @type {Concat}
 */
module.exports.Concat = require( './src/concat' ).Concat
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
/**
 *
 * @type {FillForm}
 */
module.exports.FillForm = require( './src/fillform' ).FillForm
/**
 *
 * @type {FDFGenerator}
 */
module.exports.FDFGenerator = require( './src/fdf-generator' ).FDFGenerator
/**
 *
 * @type {DigitalSignature}
 */
module.exports.DigitalSignature = require('./src/digital-signature').DigitalSignature

module.exports.setup = require('./src/setup').setup

module.exports.Fix = require('./src/fix').Fix