const async = require('async')
const env = require('./../config')
const ensureExists = require('./../helpers/ensureExist')
const scrapingManager = require('./../managers/scrapingManager')
const pdfManager = require('./../managers/pdfManager')
const senderManager = require('./../managers/senderManager')

module.exports = (manga) => {
    if (!mangaIsInList(manga)) { return }
    async.waterfall([
        async.apply(ensureExistsFolder, env.PDF_FOLDER),
        async.apply(getPagesURLs, manga),
        getImages,
        generatePDF
    ], (err, pdfName) => {
        manga.fileName = pdfName
        senderManager.send(err, manga) 
    })
}

function mangaIsInList(manga) {
    let sanitizeMangaName = manga.title.toLowerCase()
    let likes = env.MANGA_LIKES.split(',')
    let mangaLikes = likes.filter(like => sanitizeMangaName.includes(like))
    return mangaLikes.length > 0
}

function ensureExistsFolder (folder, callback) {
    ensureExists(folder).then(() => {
        callback(null)
    }).catch(err => {
        callback(err) 
    })
}

function getPagesURLs (manga, callback) {
    scrapingManager.getRelativeUrl(manga.referenceUrl).then(data => {
        manga.setPagesData(data.numberOfPages, data.relativeUrl)
        callback(null, manga)
    }).catch(err => {
        callback(err)
    })
}

function getImages (manga, complition) {
    let mangaPagesIndex = Array.from({length: manga.numberOfPages}, (v, k) => `${k + 1}`)
    async.each(mangaPagesIndex, (index, callback) => {
        scrapingManager.getUrlImageFrom(manga.pages[index].pageUrl).then(imageUrl => {
            manga.pages[index].setImageUrl(imageUrl)
            callback(null)
        }).catch((err) => {
            callback(err)
        })
    }, err => {
        complition(err, manga)
    })
}

function generatePDF(manga, complition) {
    pdfManager.generatePDF(manga).then(pdfPath => {
        complition(null, pdfPath)
    }).catch(err => {
        complition(err) 
    })
}
