'use strict'
const test = require( 'tape' ),
	fs = require( 'fs' ),
	Subject = require( './fdf-generator' ).FDFGenerator,
	_FillForm = require( './fillform' ).FillForm,
	pdfData = require('./fdf-generator').PdfData,
	assert = require( "assert" );


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
		FDFGenerator = new Subject( '../test-data/fw9.pdf', fieldValues )


	FDFGenerator.write()
		.then( fdf => {
			let FillForm = new _FillForm( fdf, '../test-data/fw9.pdf' )
			FillForm.write()
				.then( pdf => {
					return pdfData( pdf )
				} )
				.then( data => {
					t.plan( fieldValues.length )
					fieldValues.map( v => {
						let field = data.find( x => x[ 'FieldName' ] === v.fieldname )
						if(typeof v.fieldvalue === 'boolean') {
							if(v.fieldvalue) t.equal(field['FieldValue'], field['FieldStateOption'])
							else t.equal(field['FieldValue'], 0)
						}
						else t.equal( field[ 'FieldValue' ], v.fieldvalue )
					} )
				} )

		} )
} )
test( 'Throws exception on mismatched inputs', t => {
	const fieldValues = [
			{
				fieldname: "invalidFieldName",
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
		FDFGenerator = new Subject( '../test-data/fw9.pdf', fieldValues )
	FDFGenerator._validate()
		.then(() => {
			console.log('here')
			t.fail()
			t.end()
		})
		.catch(e => {
			console.error(e)
			t.equal('mismatched field name mapping', e.message)
			t.end()
		})
	//t.equal(assert.throws(() => {FDFGenerator._validate()}), undefined, 'Assert an exception has been thrown')
} )

test('throws exception on invalid constructor arguments', t => {
	t.equal(assert.throws(function() { Subject._constructorValidations('no', null)}), undefined, 'Assert an exception has been thrown')
	t.end()
})
