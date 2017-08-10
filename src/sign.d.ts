import { FilePath } from '../index';
export declare type SignOptions = {
    password?: string;
    reason?: string;
    fieldName?: string;
    useExistingSignatureField?: boolean;
};
export declare class Sign {
    pdf: FilePath;
    private cert;
    private key;
    private opt;
    out: FilePath;
    private commandOpts;
    constructor(pdf: FilePath, cert: FilePath, key: FilePath, opt?: SignOptions, out?: FilePath);
    write(): Promise<FilePath>;
}
