const env = require('./../config')
const nodemailer = require('nodemailer')
const path = require('path')

const transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: true,
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: env.SENDER_EMAIL,
        pass: env.SENDER_EMAIL_PASSOWRD
    }
});

const emailMessage = {
    from: env.SENDER_EMAIL,
    to: [env.KINDLE_EMAIL]
}

function sendManga(title, fileName) {
    let message = Object.assign({}, emailMessage)
    message.subject = title
    message.text = title
    message.attachments = [{
        filename: fileName,
        path: env.PDF_FOLDER + fileName,
        contentType: 'application/pdf'
    }]

    return new Promise((resolve, reject) => {
        transporter.sendMail(message, (error, info) => {
            console.log(error)
            error ? reject() : resolve() 
        })
    })
}

function sendError(error, title, referenceUrl) {
    let message = Object.assign({}, emailMessage)
    message.to = env.ERROR_EMAIL
    message.subject = `Error: ${title}`
    message.html = `
    <div style="background: #2a2a2a; width: 80%; padding: 30px; margin: auto; border-radius: 20px; text-align: center;">
        <img src="https://image.flaticon.com/icons/png/512/190/190406.png" width="100" height="100" alt="Cancel free icon" title="Cancel free icon">
        <h1 style="color: white; font-family:'Arial'"><strong>Manga Manager Error</strong></h1>
        <p style="color: white; font-family:'Arial'">${error}</p>
        <p style="color: white; font-family:'Arial'"><strong>Manga link</strong>: <a href="${referenceUrl}">${title}</a></p>
    </div>`
    transporter.sendMail(message, (error, info) => {
        console.log(error)
        retrun 
    })
}


module.exports = {
    sendManga: sendManga,
    sendError: sendError
}