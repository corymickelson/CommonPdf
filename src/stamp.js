/**
 * Created by cory on 12/30/16.
 */
'use strict'
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
	 * @param {String} outfile - out put file location. Defaults to /tmp
	 */
	constructor( pdf, outfile ) {
		//validate input
		this.pdf = pdf
		this.target = null
		//this.out = outfile ||
		//assign properties to this
	}

	/**
	 * @desc Generates a new pdf with image at the provided coordinates and dimensions
	 * @param {String} img - data url
	 * @param {{x:Number, y:Number, width:Number, height:Number}} opts -
	 * @return {Promise<String>} -
	 */
	_stamp( img, opts ) {
		return new Promise( ( fulfill, reject ) => {
			let out = '/tmp/placeholder.pdf',
				placeholderStampPdf = '/tmp/placeholderStamped.pdf',
				tmpPdf = new PDFDocument()
			tmpPdf.image( img, opts.x, opts.y, { width: opts.width, height: opts.height } )
			tmpPdf.pipe( fs.createWriteStream( out ) )
			tmpPdf.end()
			exec( `pdftk ${this.pdf} stamp ${out} output ${placeholderStampPdf}`, { shell: '/bin/sh' }, ( error, stdout, stderr ) => {
				if( error || stderr ) reject( error )
				else fulfill( placeholderStampPdf )
			} )
		} )
	}

	_burst() {
		return new Promise( ( fulfill, reject ) => {
			let command = `pdftk ${this.pdf} burst && find -name "pg_*.pdf"`
			exec( command, { shell: '/bin/sh' }, ( error, stdin, stderr ) => {
				if( error || stderr ) reject( error )
				else {
					fulfill( stdin.split( '\n' )
						.filter( x => x.length > 0 ) )
				}
			} )
		} )
	}

	write( img, page, opts ) {
		let pages;
		return new Promise( ( fulfill, reject ) => {
			if( !page || typeof page !== 'number' ) reject( 'Page number required.' )
			this._burst()
				.then( burstPages => {
					pages = burstPages
					let pageString = page.toString()
					if( pageString.length < 4 ) pageString = `0${page}`
					this.target = pages.find( x => x.indexOf( pageString ) !== -1 )
					return Promise.resolve()
				} )
				.then( () => {
					return this._stamp( img, { width: opts.width, height: opts.height, x: opts.x, y: opts.y } )
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

