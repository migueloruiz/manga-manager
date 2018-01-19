const env = require('./../config')
const emailManager = require('./emailManager')
const notificationManager = require('./notificationManager')
const fs = require('fs');

module.exports = { 
    send: (err, manga) => {
        if (err) {
            emailManager.sendError(err, manga.title, manga.referenceUrl)
            notificationManager.notify(manga.title, manga.referenceUrl, false)
        } else {
            emailManager.sendManga(manga.title, manga.fileName).then(() => {
                notificationManager.notify(manga.title, manga.referenceUrl, true)
                remove(manga.fileName)
            }).catch(() => {
                notificationManager.notify(manga.title, manga.referenceUrl, false)
                remove(manga.fileName)
            })
        }  
    }
}

function remove(fileName) {
    if (fileName)
        fs.unlinkSync(env.PDF_FOLDER + fileName)
}
