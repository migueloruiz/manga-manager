const async = require('async')
const fs = require('fs')
const request = require('request')
const PDFDocument = require ('pdfkit')
const env = require('./../config')

const Constants = {
    format: '.pdf',
    width: 891,
    heigth: 1300,
    titlePositionX: 0,
    titlePositionY: 600,
    titleFontSize: 60
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
}

function sanitizePDFName(name) {
    return name.trim().replaceAll(' ', '-') + Constants.format
}

function generatePDF(manga) {
    let mangaPagesIndex = Array.from({length: manga.numberOfPages}, (v, k) => `${k + 1}`)
    let pdfName = sanitizePDFName(manga.title)
    var doc = new PDFDocument({size: [Constants.width, Constants.heigth]})
    doc.fontSize(Constants.titleFontSize).text(manga.title, Constants.titlePositionX, Constants.titlePositionY, {width: Constants.width, align: 'center'})
    doc.pipe(fs.createWriteStream(env.PDF_FOLDER + pdfName))

    return new Promise((resolve, reject) => {
        async.eachSeries(mangaPagesIndex, (index, callback) => {
            let imageUrl = manga.pages[index].imageUrl
            request({url: imageUrl, encoding: null }, (error, response, body) => {
                if (error || response.statusCode !== 200) { callback(`Can't download image from ${imageUrl}`) }
                doc.addPage()
                doc.image(new Buffer(body, 'base64'), 0, 0, {width: 891})
                callback(null)
            })
        }, function(err) {
            doc.end()
            err ? reject(err) : resolve(pdfName)
        })
    })
}

module.exports = {
    generatePDF: generatePDF
}