const envalid = require('envalid')
const { str, email, bool, port, url, num } = envalid

module.exports = envalid.cleanEnv(process.env, {
    PROJECT: str(),
    HOST: str(),
    IS_DEV: bool(),
    PORT: port({ default: 4000, desc: 'The port to start the server on' }),
    EMAIL_HOST: str(),
    EMAIL_PORT: num(),
    KINDLE_EMAIL: email(),
    SENDER_EMAIL: email(),
    ERROR_EMAIL: email(),
    SENDER_EMAIL_PASSOWRD: str(),
    MANGASTREAM_URL: url(),
    IFTTT_TRIGGER_URL: url(),
    PDF_FOLDER: str(),
    MANGA_LIKES: str()
})