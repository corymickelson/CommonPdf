const test = require( 'tape' ),
	fs = require( 'fs' ),
	Subject = require( './src/fdf-generator' ).FDFGenerator,
	_FillForm = require( './src/fillform' ).FillForm,
	pdfData = require('./src/fdf-generator').PdfData,
	config = require( './config.json' )


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
		FDFGenerator = new Subject( '../../Documents/fw9.pdf', fieldValues )


	FDFGenerator.start()
		.then( fdf => {
			let FillForm = new _FillForm( fdf, '~/Documents/fw9.pdf' )
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

