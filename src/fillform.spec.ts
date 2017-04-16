'use strict'
import * as test from 'tape'
import {join} from 'path'
import {FDFGenerator as Subject, PdfData} from './fdf-generator'
import {FillForm} from './fillform'

const pdfFile =  '../test-data/fw9.pdf'

test( 'Name, Business Name, S Corp, and Partnership', t => {
	const fieldValues = [
			{
				fieldname: "topmostSubform[0].Page1[0].f1_1[0]",
				fieldvalue: "test"
			},
			{
				fieldname: "topmostSubform[0].Page1[0].f1_2[0]",
				fieldvalue: "skyslope"
			},
			{
				fieldname: 'topmostSubform[0].Page1[0].FederalClassification[0].c1_1[2]',
				fieldvalue: true
			},
			{
				fieldname: 'topmostSubform[0].Page1[0].FederalClassification[0].c1_1[3]',
				fieldvalue: true
			} ],
		FDFGenerator = new Subject( pdfFile, fieldValues )


	FDFGenerator.write()
		.then( fdf => {
			let fillForm = new FillForm( fdf, pdfFile )
			return fillForm.write()
		} )
		.then( pdf => {
			return PdfData( pdf )
		} )
		.then( data => {
			t.plan( fieldValues.length )
			fieldValues.map( v => {
				let field = data.find( x => x[ 'FieldName' ] === v.fieldname )
				if( typeof v.fieldvalue === 'boolean' ) {
					if( v.fieldvalue ) t.equal( field[ 'FieldValue' ], field[ 'FieldStateOption' ] )
					else t.equal( field[ 'FieldValue' ], 0 )
				}
				else t.equal( field[ 'FieldValue' ], v.fieldvalue )
			} )
		} )
} )

test( 'Name, Business Name, S Corp, and Partnership, flatten', t => {
	const fieldValues = [
			{
				fieldname: "topmostSubform[0].Page1[0].f1_1[0]",
				fieldvalue: "test"
			},
			{
				fieldname: "topmostSubform[0].Page1[0].f1_2[0]",
				fieldvalue: "skyslope"
			},
			{
				fieldname: 'topmostSubform[0].Page1[0].FederalClassification[0].c1_1[2]',
				fieldvalue: true
			},
			{
				fieldname: 'topmostSubform[0].Page1[0].FederalClassification[0].c1_1[3]',
				fieldvalue: true
			} ],
		FDFGenerator = new Subject( pdfFile, fieldValues )
	t.plan(2)
	FDFGenerator.write()
		.then( fdf => {
			let fillForm = new FillForm( fdf, pdfFile, ['flatten'] )
			return fillForm.write()
		} )
		.then( pdf => {
			t.ok(pdf)
			return PdfData( pdf )
		} )
		.then( data => {
			t.equal(data.length, 0)
		} )
} )
