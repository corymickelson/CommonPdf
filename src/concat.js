/**
 * Created by cory on 12/29/16.
 */
'use strict'

const fs = require( 'fs' ),
	exec = require( 'child_process' ).exec,
	join = require( 'path' ).join

/**
 * @class Concat
 */
class Concat {
	/**
	 *
	 * @param {Array<String>} docs - document file paths
	 * @param {String} [outfile] - out file path
	 * @param {Array<{start:Number, end:Number|String}>} [options] - page number ranges, split ex 1-2, 4-end
	 */
	constructor( docs, outfile, options = [] ) {
		this.docs = docs.map( doc => {
			if( !fs.existsSync( doc ) ) throw new Error( `File not found ${doc}` )
			return doc
		} )
		if( Array.isArray( options ) && options.length > 0 ) {
			this.options = options.reduce( ( accum, item, index ) => {
				accum.push( [ `${item.start}${!item.end ? '' : '-'}${item.end || '' }` ] )
				return accum
			}, [] )
		} else this.options = options
		if(this.docs.length > 1 && this.options.length > 0)
			return new Error('Can not concat and split. Try, concatenating first, and splitting afterwards.')
		this.out = outfile || '/tmp/out.pdf'

	}

	/**
	 *
	 * @returns {Promise<String>} - out file path
	 */
	write() {
		return new Promise( ( fulfill, reject ) => {
			let command = `pdftk ${this.docs.join( ' ' )} cat ${this.options.join( " " )} output ${this.out}`
			exec( command, ( error, stdout, stderr ) => {
				error || stderr ? reject( error ) : fulfill( this.out )
			} )
		} )
	}
}

module.exports.Concat = Concat
