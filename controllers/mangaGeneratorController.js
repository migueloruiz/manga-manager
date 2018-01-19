const async = require('async')
const env = require('./../config')
const ensureExists = require('./../helpers/ensureExist')
const scrapingManager = require('./../managers/scrapingManager')
const pdfManager = require('./../managers/pdfManager')
const senderManager = require('./../managers/senderManager')

module.exports = (manga) => {
    if (!mangaIsInList(manga)) { return }
    console.log(manga.title)
    async.waterfall([
        async.apply(ensureExistsFolder, env.PDF_FOLDER),
        async.apply(getPagesURLs, manga),
        getImages,
        generatePDF
    ], (err, pdfName) => {
        manga.fileName = pdfName
        console.log('end general', err, manga.title)
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
        console.log('folder check')
        callback(null)
    }).catch(err => {
        callback(err) 
    })
}

function getPagesURLs (manga, callback) {
    scrapingManager.getRelativeUrl(manga.referenceUrl).then(data => {
        manga.setPagesData(data.numberOfPages, data.relativeUrl)
        console.log('getPagesURLs')
        callback(null, manga)
    }).catch(err => {
        callback(err)
    })
}

function getImages (manga, complition) {
    let mangaPagesIndex = Array.from({length: manga.numberOfPages}, (v, k) => `${k + 1}`)
    console.log('getImages')
    async.each(mangaPagesIndex, (index, callback) => {
        scrapingManager.getUrlImageFrom(manga.pages[index].pageUrl).then(imageUrl => {
            manga.pages[index].setImageUrl(imageUrl)
            console.log('getImageUR:', imageUrl)
            callback(null)
        }).catch((err) => {
            callback(err)
        })
    }, err => {
        console.log('getImages end')
        complition(err, manga)
    })
}

function generatePDF(manga, complition) {
    pdfManager.generatePDF(manga).then(pdfPath => {
        console.log('generatePDFEnd:', pdfPath)
        complition(null, pdfPath)
    }).catch(err => {
        complition(err) 
    })
}
