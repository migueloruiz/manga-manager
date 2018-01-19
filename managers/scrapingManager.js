const scrapeIt = require("scrape-it")
const DropDownOptios = {
    items: {
        listItem: '.dropdown-menu li:last-child',
        data: { 
            title: 'a',
            link: { selector: 'a', attr: 'href'}
        }
    }
}
const mangaPageOptios = {
    mangaPage: {
        selector: ".page a img",
        attr: "src"
    }
}

function getRelativeUrl(referenceUrl) {
    return new Promise((resolve, reject) => {
        scrapeIt(referenceUrl, DropDownOptios).then(page => {
            let regex = /.+\((\d+)\)$/ig
            let matchData = page.items.reduce((data, item) => {
                let match = regex.exec(item.title)
                if (!match) return data
                let lastItemUrl = item.link.split('/').pop()
                return {
                    numberOfPages: match[1],
                    relativeUrl: item.link.slice(0, -lastItemUrl.length)
                }
            }, null)

            matchData ? resolve(matchData) : reject(`Can't find number of pages in ${referenceUrl}`)
        })
    })
}

function getUrlImageFrom(pageUrl) {
    return new Promise((resolve, reject) => {
        scrapeIt(pageUrl, mangaPageOptios).then(data => {
            if (data) {
                resolve('http:' + data.mangaPage)
            } else {
                reject(`Can't find image form in ${pageUrl}`)
            }
        })
    })
}

module.exports = {
    getRelativeUrl: getRelativeUrl,
    getUrlImageFrom: getUrlImageFrom
}