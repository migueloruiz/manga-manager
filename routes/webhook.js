const router = require('express').Router()
var Manga = require('./../models/manga')
const mangaGenerator = require('./../controllers/mangaGeneratorController')

router.post('/', function (req, res) {
    Manga.createWithBody(req.body).then((manga) => {
        res.sendStatus(200)
        mangaGenerator(manga)
        return
    }).catch((errors) => {
        res.status(404).json(errors)
        return
    })
})

module.exports = router