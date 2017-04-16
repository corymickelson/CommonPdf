import { FilePath } from "../index";
export declare type FDFField = {
    fieldname: string;
    fieldvalue: string | number | boolean;
};
export declare type FDFFieldsMap = Array<FDFField>;
export declare type FieldAnnotations = {
    FieldType?: string;
    FieldName?: string;
    FieldFlags?: number;
    FieldJustification?: string;
    FieldStateOption?: string | number;
    FieldMaxLength?: number;
};
export declare class FDFGenerator {
    values: FDFFieldsMap;
    pdf: string;
    out: string;
    grep: string;
    pdfData: [FieldAnnotations];
    header: string;
    footer: string;
    constructor(pdf: FilePath, values: FDFFieldsMap);
    private static _constructorValidations(pdf, values);
    write(): Promise<FilePath>;
    _validate(): Promise<[FieldAnnotations]>;
    private _write(fdfMap);
    private static _fieldWriter(field);
    private _checkAg();
    static _extractFieldNames(pdf: string): Promise<[FieldAnnotations]>;
    private _assignments(fields);
}
export declare const PdfData: typeof FDFGenerator._extractFieldNames;
