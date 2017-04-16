import { FilePath } from "../index";
export declare type SigningOptions = {
    location?: string;
    reason?: string;
    passwd: string;
};
export declare type DigitalSignaturePostParams = {
    certificate?: FilePath;
    options: SigningOptions;
};
export declare enum DigitalSignatureOption {
    Post = 0,
    Inline = 1,
}
export declare type CommonPdfOptionalSignature = {
    encrypt: DigitalSignatureOption;
    config: DigitalSignaturePostParams;
};
/**
 * @desc Secure Pdf with digital signature.
 *      This class uses PortableSigner and requires java is installed on your path
 *
 *      FilePaths must be absolute.
 */
export declare class DigitalSignature {
    pdf: FilePath;
    cert: FilePath;
    signOpts: SigningOptions;
    outfile: FilePath;
    constructor(pdf: FilePath, cert: FilePath, signOpts: SigningOptions, outfile: FilePath);
    write(): Promise<FilePath>;
}
export declare function future<T>(fn: Function, args: Array<any>): Promise<T>;
