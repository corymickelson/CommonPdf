/**
 * Created by cory on 12/29/16.
 */
'use strict'
import {exec} from 'child_process'
import {v4 as id} from 'uuid'
import { FilePath } from "../index";

export class Rotate {
	public direction:string
	public out:FilePath

	constructor( public source:FilePath, public target:number, opts:{direction:string}, outfile?:FilePath ) {
		this.out = (outfile && outfile.substr(0, 4) === '/tmp') ? outfile : `/tmp/${outfile || id()}.pdf`
		this.direction = opts.direction || 'north'
	}

	/**
	 *
	 * @param {Number} target - target page
	 * @returns {Promise<String>} - a substring of the rotation command
	 * @private
	 */
	_cat( target:number ):Promise<string> {
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
	write(): Promise<string> {
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
