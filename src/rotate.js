/**
 * Created by cory on 12/29/16.
 */
'use strict'
const exec = require( 'child_process' ).exec,
	id = require('uuid').v4

class Rotate {
	/**
	 *
	 * @param {String} source - pdf file path
	 * @param {Number} targetFile - page number ( 1 based page number )
	 * @param {{out:String, direction:String}} opts - output file, north/south/east/west
	 */
	constructor( source, targetFile, opts ) {
		// check that source exists first
		this.source = source
		this.target = targetFile
		this.out = `/tmp/${opts.out || id()}`
		this.out = (opts.out && opts.out.substr(0, 4) === '/tmp') ? opts.out : `/tmp/${opts.out || id()}.pdf`
		this.direction = opts.direction || 'north'
	}

	/**
	 *
	 * @param {Number} target - target page
	 * @returns {Promise<String>} - a substring of the rotation command
	 * @private
	 */
	_cat( target ) {
		return new Promise( ( fulfill, reject ) => {
			if( target === 1 ) fulfill( `1${this.direction} 2-end` )
			else {
				let command = `pdftk ${this.source} dump_data | grep -i NumberOfPages`
				exec( command, {shell: '/bin/sh'}, ( error, stdin, stderr ) => {
					if( error || stderr ) reject( error )
					let pageCount = parseInt( stdin.substr( stdin.indexOf( ':' ) + 2 ), stdin.indexOf( '\n' ) )
					if( pageCount < target ) reject( 'page out of bounds' )
					if( target === pageCount ) fulfill( `1-${target - 1} ${target}${this.direction}` )
					else fulfill( `1-${target - 1} ${target}${this.direction} ${target + 1}-end` )
				} )
			}

		} )
	}

	/**
	 *
	 * @returns {Promise<String>} - output pdf path
	 */
	write() {
		return new Promise( ( fulfill, reject ) => {
			this._cat( this.target )
				.then( x => {
					let command = `pdftk ${this.source} cat ${x} output ${this.out} `
					exec( command, {shell: '/bin/sh'}, ( error, stdin, stderr ) => {
						if( error || stderr ) reject( error )
						else fulfill( this.out )
					} )
				} )
		} )
	}
}
exports.Rotate = Rotate
