
const env = require('./../config')
const request = require('request')

module.exports = {
    notify: (title, referenceUrl, succes) => {
        request({
            url: env.IFTTT_TRIGGER_URL,
            method: 'POST',
            json: {
                value1: title,
	            value2: succes ? 'Delivered' : 'Fail',
	            value3: referenceUrl
            }
        }, (error, response, body) => { return })
    }
}