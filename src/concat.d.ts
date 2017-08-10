import { FilePath } from "../index";
import { SignOptions } from './sign';
export declare class Concat {
    docs: Array<FilePath>;
    options: Array<{
        start: number;
        end: number | string;
    }>;
    signOpts: SignOptions & {
        cert: FilePath;
        key: FilePath;
    };
    out: string;
    signInline: boolean;
    password: string;
    postProcessSigning: boolean;
    constructor(docs: Array<FilePath>, options?: Array<{
        start: number;
        end: number | string;
    }>, signOpts?: SignOptions & {
        cert: FilePath;
        key: FilePath;
    }, outfile?: FilePath);
    write(): Promise<FilePath>;
}
