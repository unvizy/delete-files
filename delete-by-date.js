import fs from 'node:fs';
import path from 'path'


let today = new Date();
const keepDays = new Date(today);
keepDays.setDate(today.getDate() - 5);


const directoryPath = process.argv[2];
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    let fileInfos = files.map(file => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);
        return {
            name: file,
            time: stats.mtime
        };
    });

    fileInfos.sort((a, b) => b.time - a.time);

    fileInfos.forEach(fileInfo => {
        if (fileInfo.time.getTime() <= keepDays.getTime()) {
            fs.unlink(`${directoryPath}/${fileInfo.name}`, (err) => {
                if (err) throw err;
            });
         }
    });
});

