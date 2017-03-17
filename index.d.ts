declare module 'commonpdf' {

	type FilePath = String
	type ImageUri = String
	type ImagePlacementOptions = {
		width: Number,
		height: Number,
		x: Number,
		y: Number
	}

	export class Concat {
		docs: Array<FilePath>
		outfile?: FilePath
		options?: Array<String>

		constructor( docs: Array<FilePath>, outfile?: FilePath, options?: Array<{ start: Number, end: Number|String }> )

		write(): Promise<FilePath>
	}

	export class FDFGenerator {
		header: String
		footer: String
		pdf: FilePath|Error
		values: Array<{ fieldname: String, fieldvalue: String }>|Error
		grep: String
		pdfData: Array<{ [key: string]: String|Number }>

		constructor( pdf: FilePath, values: Array<{ fieldname: String, fieldvalue: String|boolean }> )

		write(): Promise<FilePath>

		private _write( fdfMap: Array<{ fieldname: String, fieldvalue: String|Number }> ): Promise<FilePath|Error>

		private _checkAg(): Promise<boolean>

		private _validate(): Promise<Array<{ [key: string]: String|Number }>>

		private _assignments( fields: Array<{ fieldname: String, fieldvalue: String|Number }> ): Promise<Array<{ fieldname: String, fieldvalue: String|Number }>>

		static fieldWriter( field: String ): String

		static _extractFieldNames( pdf: FilePath ): Promise<Array<{ [key: string]: String|Number }>>
	}

	export class FillForm {
		fdf: FilePath
		pdf: FilePath
		out?: FilePath
		options?: Array|Error

		constructor( fdfFilePath: FilePath, pdfFilePath: FilePath, options: Array<String> )

		write(): Promise<FilePath>
	}

	export class Rotate {
		source: FilePath
		target: FilePath
		out?: FilePath
		direction: String

		constructor( source: FilePath, targetFile: Number, opts: { out: FilePath, direction: String } )

		private _cat( target: Number ): Promise<FilePath>

		write(): Promise<FilePath>
	}

	export class Stamp {
		pdf: FilePath
		target?: FilePath

		constructor( pdf: FilePath, outfile?: FilePath )

		write( img: ImageUri, page: Number, opts: ImagePlacementOptions ): Promise<FilePath>

		private _stamp( img: ImageUri, opts: ImagePlacementOptions ): Promise<FilePath>

		private _burst(): Array<String>

		static pageIndex( page: FilePath ): Number
	}
}