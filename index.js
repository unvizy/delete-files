import { unlink } from 'node:fs';
import { exec, spawn } from 'child_process'

let dir = process.argv[2];
const keepFile = 1000;

const execCommand = async (command) => {
    return new Promise((resolve, reject) => {
        exec(command, { maxBuffer: 1024 * 2048 }, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            resolve(stdout.trim());
        });
    })
};

const del = async () => {
    try {
        const totalFile = await execCommand(`ls -1t ${dir}/* | wc -l`);
        const totalDeleteFiles = totalFile - keepFile;
        const deletedFiles = await execCommand(`ls -t ${dir}/* | tail -n ${totalDeleteFiles}`);
        console.log(deletedFiles)
        for (let file of deletedFiles.split('\n')) {
            unlink(`${file}`, (err) => {
                if (err) throw err;
            });
        }
    } catch (e) {
        console.log(e)
    }
};

del();
