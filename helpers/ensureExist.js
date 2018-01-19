const fs = require('fs')

module.exports = function (folder) {
    return new Promise((resolve, reject) => {
        fs.mkdir(folder, 0777, (err) => {
            if (err && err.code != 'EEXIST') reject(`Can't create folder ${path}`)
            resolve()
        })
    })
}