
//luokka express error jatkaa siitä mihin tavallinen errori jää :)

class ExpressError extends Error {
    constructor(message, statusCode) {
        super()
        this.message = message
        this.statusCode = statusCode
    }
}

module.exports = ExpressError