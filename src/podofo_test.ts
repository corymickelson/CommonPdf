import {exec} from 'child_process'

export class PodofoTest {
    constructor() {}
    test() {
        exec('podofosign -h', ((error, stdout, stderr) => {
            console.log('error: ', error)
            console.log('stdout: ', stdout)
            console.log('stderr: ', stderr)
        }))
    }
}