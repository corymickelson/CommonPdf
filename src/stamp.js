/**
 * Created by cory on 12/30/16.
 */
const exec = require( 'child_process' ).exec,
	fs = require( 'fs' ),
	PDFDocument = require( 'pdfkit' )

/**
 * @desc Given a position and dimensions add the provided image to the provided pdf
 *
 * @class Stamp
 * @borrows PDFDocument
 * @property {String} pdf
 * @property {String} image
 * @property {{x:Number, y:Number}} coordinates
 * @property {{width:Number, height:Number}} dimensions
 */
class Stamp {

	/**
	 *
	 * @param {String} pdf - pdf file path
	 */
	constructor( pdf ) {
		//validate input
		this.pdf = pdf

		//assign properties to this
	}

	/**
	 * @desc Generates a new pdf with image at the provided coordinates and dimensions
	 * @param {String} img - data url
	 * @param {Number} page - target page
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Promise<String>} -
	 */
	_stamp( img, page, { width, height, x, y } ) {
		return new Promise( ( fulfill, reject ) => {
			let out = '/tmp/placeholder.pdf',
				placeholderStampPdf = '/tmp/placeholderStamped.pdf',
				tmpPdf = new PDFDocument()
			tmpPdf.image( img, x, y, { width, height } )
			tmpPdf.pipe( fs.createWriteStream( out ) )
			tmpPdf.end()
			exec( `pdftk ${this.pdf} stamp ${out} output ${placeholderStampPdf}`, ( error, stdout, stderr ) => {
				if( error || stderr ) reject( error )
				else fulfill( placeholderStampPdf )
			} )
		} )
	}

	apply( img, page, { width, height, x, y } ) {
		return new Promise( ( fulfill, reject ) => {
			if(!page) reject('Page number required.')
		} )
	}

	/**
	 *
	 * @private
	 * @returns {Promise<Array<String>>} - split pdf into individual pages, returns file paths
	 */
	_page() {
		return new Promise( ( fulfill, reject ) => {
			const command = ``
			exec(command, (err, stdout, stderr) => {

			})
		} )
	}

}

exports.Stamp = Stamp

