/**
 * Created by cory on 12/30/16.
 */
const exec = require( 'child_process' ).exec,
	fs = require( 'fs' ),
	PDFDocument = require( 'pdfkit' ),
	Concat = require( './concat' ).Concat

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
		this.target = null
		//assign properties to this
	}

	/**
	 * @desc Generates a new pdf with image at the provided coordinates and dimensions
	 * @param {String} img - data url
	 * @param {Number} width - image width
	 * @param {Number} height - image height
	 * @param {Number} x - page x coordinate
	 * @param {Number} y - page y coordinate
	 * @return {Promise<String>} -
	 */
	_stamp( img, { width, height, x, y } ) {
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

	_burst() {
		return new Promise( ( fulfill, reject ) => {
			let command = `pdftk ${this.pdf} burst && find -name "pg_*.pdf"`
			exec( command, ( error, stdin, stderr ) => {
				if( error || stderr ) reject( error )
				else {
					fulfill( stdin.split( '\n' )
						.filter( x => x.length > 0 ) )
				}
			} )
		} )
	}

	write( img, page, { width, height, x, y } ) {
		let pages;
		return new Promise( ( fulfill, reject ) => {
			if( !page || typeof page !== 'number' ) reject( 'Page number required.' )
			this._burst()
				.then( burstPages => {
					pages = burstPages
					let pageString = page.toString()
					if( pageString.length < 4 ) pageString = `0${page}`
					this.target = pages.find( x => x.indexOf( pageString ) !== -1 )
					Promise.resolve()
				} )
				.then( () => {
					return this._stamp( img, { width, height, x, y } )
				} )
				.then( stampedPage => {
					return new Concat( pages.reduce( ( accum, item, index ) => {
						let pageIndex = Stamp.pageIndex( item )
						accum[ pageIndex ] = pageIndex === Stamp.pageIndex( this.target ) ? stampedPage : item
						return accum
					} ) ).write()
				} )
				.then( final => {
					fulfill( final )
				} )
				.catch( e => {
					reject( e )
				} )
		} )
	}

	static pageIndex( page ) {
		let subject = page.substr( 5, 4 )
		while( subject[ 0 ] === '0' ) {
			subject = subject.substr( 1 )
		}
		return parseInt( subject ) - 1
	}

}

exports.Stamp = Stamp

