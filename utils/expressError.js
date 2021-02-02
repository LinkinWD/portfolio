
//luokka express error jatkaa siitä mihin tavallinen errori jää :)
// eli luodaan uusi expresserror objecti ja annetaans sille errorin viesti ja statuskoodi.
class ExpressError extends Error {
    constructor(message, statusCode) {
        super()
        this.message = message
        this.statusCode = statusCode
    }
}

module.exports = ExpressError