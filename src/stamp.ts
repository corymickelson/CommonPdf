/**
 * Created by cory on 12/30/16.
 */
'use strict'
import { exec } from 'child_process'
import { v4 as id } from 'uuid'
import { Concat } from './concat'
import { FilePath } from '../index'
import { createWriteStream, unlink } from 'fs'
import * as PDFDocument from 'pdfkit'
import { basename } from 'path'


/**
 * @description Image options object represents all required data to stamp an image on a pdf. Ensure that x,y coordinates are pdf coordinates (0,0 is bottom left)
 */
export type ImgOpts = { x: number, y: number, width: number, height: number, uri: string }

export interface StampContract {
	file: string | FilePath
	page: number
	stamps: Array<ImgOverlay>
}

export type ImgLocation = { x: number, y: number, width: number, height: number }

export type ImgOverlay = {
	uri: string
	locations: Array<ImgLocation>
}

/**
 * @desc Stamp creates a new transparent pdf with the images at the provided locations, and stamps the
 *        original pdf once.
 */
export class Stamp {
	/**
	 * @description the page name after the document has gone through burst
	 * @see Stamp.burst
	 */
	public target: string
	public out: FilePath
	public pdf: FilePath
	public forcetmp: boolean

	/**
	 *
	 * @param {String} contract - pdf stamping data contract
	 * @param {String} [outfile] - out put file location. Defaults to /tmp
	 * @param {Boolean} [forcetmp] - force the outfile to /tmp if true
	 */
	constructor( public contract: StampContract, outfile?: FilePath, forcetmp?: boolean ) {
		this.pdf = contract.file
	        this.target = null
		this.forcetmp = (forcetmp === undefined) ? true : forcetmp
		if ( outfile && !this.forcetmp ) this.out = outfile
		else this.out = (outfile && outfile.substr( 0, 4 ) === '/tmp') ? outfile : `/tmp/${outfile || id() + '.pdf'}`
	}

	/**
	 * @desc Generates a new pdf with image at the provided coordinates and dimensions
	 * @param {{x:Number, y:Number, width:Number, height:Number}} imgs -
	 * @return {Promise<String>} -
	 * @private
	 */
	private _stamp( imgs: Array<ImgOverlay> ): Promise<string> {
		return new Promise( ( fulfill, reject ) => {
			let out = `/tmp/${id()}.pdf`,
				placeholderStampPdf = `/tmp/${id()}.pdf`,
				tmpPdf = new PDFDocument()
			imgs.forEach( ( { uri, locations } ) => {
				locations.forEach( ( { x, y, width, height } ) => {
					tmpPdf.image( uri, x, y, { width, height } )
				} )
			} )
			/*imgs.forEach( ( { uri, height, width, x, y } ) => {
				tmpPdf.image( uri, x, y, { width, height } )
			} )*/
			tmpPdf.pipe( createWriteStream( out ) )
			tmpPdf.end()
			exec( `pdftk ${this.target} stamp ${out} output ${placeholderStampPdf}`, ( error, stdout, stderr ) => {
				if ( error || stderr ) reject( error )
				else fulfill( placeholderStampPdf )
			} )
		} )
	}

	/**
	 * @desc Burst file into individual pages.
	 *       Files written to /tmp with documentId prefix
	 *
	 * @returns {Promise<string[]>} - list of file names, ex. page_1.pdf, page_2.pdf, etc...
	 *
	 * @todo: The find operation will return an error for any file without x permission in /tmp directory
	 *        the current work around is to ignore stderr in this process.
	 *        Trying to grep filter 'Permission denied' has not yet worked.
	 */
	burst(): Promise<string[]> {
		return new Promise( ( fulfill, reject ) => {
			let documentId = basename( this.pdf, '.pdf' )
			let command = `pdftk ${this.pdf} burst output /tmp/${documentId}-pg_%d.pdf && find -L /tmp -name '${documentId}-pg_*.pdf'`
			exec( command, ( error, stdin, stderr ) => {
				fulfill( stdin.split( '\n' )
					.filter( x => x.length > 0 ) )
			} )
		} )
	}

	/**
	 * @desc Write new pdf with image stamp.
	 * @returns {Promise<String>} - output file location
	 */
	public write(): Promise<string> {
		let pages;
		return new Promise( ( fulfill, reject ) => {
			if ( !this.contract.page || typeof this.contract.page !== 'number' ) reject( 'Page number required.' )
			this.burst()
				.then( burstPages => {
					pages = burstPages
					let pageString = `pg_${this.contract.page}.pdf`
					this.target = pages.find( x => x.indexOf( pageString ) !== -1 )
					return Promise.resolve()
				} )
				.then( () => {
					return this._stamp( this.contract.stamps )
				} )
				.then( stampedPage => {
					return new Concat( pages.reduce( ( accum, item, index ) => {
						let pageIndex = Stamp.pageIndex( item ),
							targetIndex = Stamp.pageIndex( this.target )
						accum[ pageIndex ] = pageIndex === targetIndex ? stampedPage : item
						return accum
					}, [] ), null, null, this.out, this.forcetmp ).write()
				} )
				.then( final => {
					Promise.all( pages.map( p => unlink( p, err => {
						if ( err ) reject( err )
						return Promise.resolve()
					} ) ) )
						.then( _ => {
							fulfill( final )
						} )
				} )
				.catch( e => {
					reject( e )
				} )
		} )
	}

	/**
	 * @description Parse the page name generated from burst to an integer
	 * @static
	 * @param {string} page - filename
	 * @returns {number}
	 */
	static pageIndex( page: string ): number {
		let subject = page.split( '_' )[ 1 ]
		return parseInt( subject ) - 1
	}

}
