import {exec} from 'child_process'
import {v4} from 'uuid'
import {FilePath} from '../index'

export type SignOptions = {
    password?: string
    reason?: string
    fieldName?: string
    useExistingSignatureField?: boolean
}

export class Sign {
    private commandOpts:string = ''

    constructor(public pdf: FilePath,
                private cert: FilePath,
                private key: FilePath,
                private opt?: SignOptions,
                public out?: FilePath) {
        if(this.out == null) {
            this.out = `/tmp/${v4()}.pdf`
        }
        if(this.opt) {
            if(this.opt.fieldName) this.commandOpts += ` -field-name ${this.opt.fieldName}`
            if(this.opt.password) this.commandOpts += ` -password ${this.opt.password}`
            if(this.opt.reason) this.commandOpts += ` -reason "${this.opt.reason}"`
            if(this.opt.useExistingSignatureField) this.commandOpts += ' -field-use-existing'
        }
    }

    async write(): Promise<FilePath> {
        return new Promise<FilePath>((fulfill:Function, reject:Function) => {
            const command = `podofosign -in ${this.pdf} -cert ${this.cert} -pkey ${this.key} -out ${this.out}`
            exec(`${command}${this.commandOpts}`, (e:Error, stdout:string, stderr:string) => {
                e ? reject(stderr) : fulfill(this.out)
            })
        })
    }
}