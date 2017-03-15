/**
 * Created by cory on 1/13/17.
 */
'use strict'
const test = require( 'tape' ),
	fs = require( 'fs' ),
	join = require( 'path' ).join,
	exec = require( 'child_process' ).exec,
	Subject = require( './concat' ).Concat


test( 'Concat', t => {
	new Subject( [ join( __dirname, '../test-data/IntelliJIDEA_ReferenceCard.pdf' ), join( __dirname, '../test-data/de542.pdf' ), join( __dirname, '../test-data/fw9.pdf' ) ] )
		.write()
		.then( outFile => {
			t.plan( 1 )
			exec( `pdftk ${outFile} dump_data | grep -i NumberOfPages`, ( error, stdin, stderr ) => {
				if( error || stderr ) t.fail()
				else {
					t.equal( stdin[ stdin.indexOf( ':' ) + 2 ], '8' )
				}
			} )
		} )
		.catch( e => {
			t.fail()
		} )
} )
test( 'Split', t => {
	new Subject( [ join( __dirname, '../test-data/fw9.pdf' ) ], null, [ {
		start: 1,
		end: 2
	}, {
		start: 4,
		end: 'end'
	} ] )
		.write()
		.then( outFile => {
			t.plan( 1 )
			exec( `pdftk ${outFile} dump_data | grep -i NumberOfPages`, ( error, stdin, stderr ) => {
				if( error || stderr ) t.fail()
				else {
					t.equal( stdin[ stdin.indexOf( ':' ) + 2 ], '3' )
				}
			} )
		} )
		.catch( e => {
			t.fail()
		} )
} )
test( 'Split 1-1', t => {
	new Subject( [ join( __dirname, '../test-data/fw9.pdf' ) ], null, [ {
		start: 1,
		end: 1
	}, {
		start: 4,
		end: 'end'
	} ] )
		.write()
		.then( outFile => {
			t.plan( 1 )
			exec( `pdftk ${outFile} dump_data | grep -i NumberOfPages`, ( error, stdin, stderr ) => {
				if( error || stderr ) t.fail()
				else {
					t.equal( stdin[ stdin.indexOf( ':' ) + 2 ], '2' )
				}
			} )
		} )
		.catch( e => {
			t.fail()
		} )
} )
test( 'Concat and split', t => {
	t.plan( 1 )
	t.equal( new Subject( [ join( __dirname, '../test-data/fw9.pdf' ), join( __dirname, '../test-data/de542.pdf' ) ], null, [ {
			start: 1,
			end: 1
		}, {
			start: 4,
			end: 'end'
		} ] ).message,
		'Can not concat and split. Try, concatenating first, and splitting afterwards.' )
} )
