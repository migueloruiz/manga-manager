const env = require('./../config')

class MangaPage {
    constructor(name, pageUrl) {
        this.name = name
        this.pageUrl = pageUrl
        this.imageUrl = null
        this.imageFormat = null
    }

    setImageUrl(imageUrl) {
        this.imageUrl = imageUrl
        this.imageFormat = imageUrl.split('.').pop()
    }
}

module.exports = MangaPage