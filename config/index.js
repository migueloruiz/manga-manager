const envalid = require('envalid')
const { str, email, bool, port, url, num } = envalid

module.exports = envalid.cleanEnv(process.env, {
    PROJECT: str(),
    HOST: str(),
    IS_DEV: bool(),
    PORT: port({ default: 4000, desc: 'The port to start the server on' }),
    SENDGRID_API_KEY: str(),
    KINDLE_EMAIL: str(),
    SENDER_EMAIL: email(),
    ERROR_EMAIL: email(),
    MANGASTREAM_URL: url(),
    IFTTT_TRIGGER_URL: url(),
    PDF_FOLDER: str(),
    MANGA_LIKES: str()
})