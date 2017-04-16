/**
 * Created by cory on 1/17/17.
 */
'use strict'

import * as test from 'tape'
import {Rotate as Subject} from './rotate'
import {join} from 'path'
import {exec} from 'child_process'

test( 'rotate first page.', t => {
	t.plan( 2 )
	let source = join( __dirname, '../test-data/fw9.pdf' ),
		target = 1,
		opts = { direction: 'east' }
	new Subject( source, target, opts )
		.write()
		.then( out => {
			let command = `pdftk ${out} dump_data | grep -i PageMediaRotation`
			exec( command, {shell: '/bin/sh'},( error, stdin, stderr ) => {
				if( error || stderr ) t.fail()
				const pageData = stdin.split( '\n' ).filter(x => x.length > 0)
				t.equal(4, pageData.length)
				t.equal( parseInt( pageData[ 0 ].substr( pageData[ 0 ].indexOf( ':' ) + 2 ) ), 90 )
			} )
		} )
} )
test( 'rotate second page.', t => {
	t.plan( 4 )
	let source = join( __dirname, '../test-data/fw9.pdf' ),
		target = 2,
		opts = { direction: 'east' }
	new Subject( source, target, opts )
		.write()
		.then( out => {
			let command = `pdftk ${out} dump_data | grep -i PageMediaRotation`
			exec( command, {shell: '/bin/sh'}, ( error, stdin, stderr ) => {
				if( error || stderr ) t.fail()
				const pageData = stdin.split( '\n' ).filter(x => x.length > 0)
				t.equal(4, pageData.length)
				t.equal( parseInt( pageData[ 1 ].substr( pageData[ 0 ].indexOf( ':' ) + 2 ) ), 90 )
				t.equal( parseInt( pageData[ 0 ].substr( pageData[ 0 ].indexOf( ':' ) + 2 ) ), 0 )
				t.equal( parseInt( pageData[ 2 ].substr( pageData[ 0 ].indexOf( ':' ) + 2 ) ), 0 )
			} )
		} )
} )
test( 'rotate last page.', t => {
	t.plan( 3 )
	let source = join( __dirname, '../test-data/fw9.pdf' ),
		target = 4,
		opts = { direction: 'east' }
	new Subject( source, target, opts )
		.write()
		.then( out => {
			let command = `pdftk ${out} dump_data | grep -i PageMediaRotation`
			exec( command, {shell: '/bin/sh'}, ( error, stdin, stderr ) => {
				if( error || stderr ) t.fail()
				const pageData = stdin.split( '\n' ).filter(x => x.length > 0)
				t.equal(4, pageData.length)
				t.equal( parseInt( pageData[ 3 ].substr( pageData[ 0 ].indexOf( ':' ) + 2 ) ), 90 )
				t.equal( parseInt( pageData[ 2 ].substr( pageData[ 0 ].indexOf( ':' ) + 2 ) ), 0 )
			} )
		} )
} )
