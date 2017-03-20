declare module 'commonpdf' {

	type FilePath = string
	type ImageUri = string
	type ImagePlacementOptions = {
		width: Number,
		height: Number,
		x: Number,
		y: Number
	}

	/**
	 * Concat
	 *
	 * Concat is capable of creating a single pdf from multiple pdf inputs OR creating a single pdf by
	 * splitting a provided pdf at specified indexes.
	 *
	 * Concat can NOT concat multiple pdf inputs AND split them simultaneously.
	 *
	 */
	export class Concat {
		docs: Array<FilePath>
		outfile?: FilePath
		options?: Array<string>

		constructor( docs: Array<FilePath>, outfile?: FilePath, options?: Array<{ start: Number, end: Number|string }> )

		write(): Promise<FilePath>
	}

	/**
	 * FDFGenerator
	 *
	 * Generates an .fdf file for passing as a function argument to FillForm
	 *
	 * The generated fdf file is NOT validated against it's target pdf file.
	 * If the keys do not match the target's keys... well obviously this will fail to fill that field
	 *
	 * @see FillForm
	 */
	export class FDFGenerator {
		header: string
		footer: string
		pdf: FilePath|Error
		values: Array<{ fieldname: string, fieldvalue: string }>|Error
		grep: string
		pdfData: Array<{ [key: string]: string|Number }>

		constructor( pdf: FilePath, values: Array<{ fieldname: string, fieldvalue: string|boolean }> )

		write(): Promise<FilePath>

		private _write( fdfMap: Array<{ fieldname: string, fieldvalue: string|Number }> ): Promise<FilePath|Error>

		private _checkAg(): Promise<boolean>

		private _validate(): Promise<Array<{ [key: string]: string|Number }>>

		private _assignments( fields: Array<{ fieldname: string, fieldvalue: string|Number }> ): Promise<Array<{ fieldname: string, fieldvalue: string|Number }>>

		static fieldWriter( field: string ): string

		static _extractFieldNames( pdf: FilePath ): Promise<Array<{ [key: string]: string|Number }>>
	}

	/**
	 * FillForm
	 *
	 * Fills provided pdf with provided fdf data.
	 * Requires data to be formatted as an fdf file
	 *
	 * @see FDFGenerator
	 */
	export class FillForm {
		fdf: FilePath
		pdf: FilePath
		out?: FilePath
		options?: Array|Error

		constructor( fdfFilePath: FilePath, pdfFilePath: FilePath, options?: Array<string> )

		write(): Promise<FilePath>
	}

	/**
	 * Rotate
	 *
	 * Rotates a single specified document. If pdf is larger than 1 page, the page number is required.
	 *
	 * Rotation described as north|south|east|west|northwest...
	 */
	export class Rotate {
		source: FilePath
		target: FilePath
		out?: FilePath
		direction: string

		constructor( source: FilePath, targetFile: Number, opts: { out: FilePath, direction: string } )

		private _cat( target: Number ): Promise<FilePath>

		write(): Promise<FilePath>
	}

	/**
	 * Stamp
	 *
	 * Stamp an image on a pdf file.
	 *
	 * Generates a transparent pdf with image at provided coordinates, and then "stamps" that pdf onto the target pdf.
	 *
	 * If page number is not specified the stamp will appear on all pages of the pdf document
	 */
	export class Stamp {
		pdf: FilePath
		target?: FilePath

		constructor( pdf: FilePath, outfile?: FilePath )

		write( img: ImageUri, page: Number, opts: ImagePlacementOptions ): Promise<FilePath>

		private _stamp( img: ImageUri, opts: ImagePlacementOptions ): Promise<FilePath>

		private _burst(): Array<string>

		static pageIndex( page: FilePath ): Number
	}
}