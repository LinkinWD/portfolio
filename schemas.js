//serveripuolen validoitia. Ajax, postman vastaan esim.
const Joi = require('joi')

module.exports.vieraskirjaSchema = Joi.object({
    vieraskirja: Joi.object ({
        kirjoittaja: Joi.string().required(),
        kommentti: Joi.string().required()
    }).required()
})

module.exports.ruokaSchema = Joi.object({
    ruokala: Joi.object({
        nimi: Joi.string().required(),
        hinta: Joi.number().required().min(0),
        määrä: Joi.number().required().min(0)
    }).required()
})




// Käytän tässä aika hepposia, mutta on vaan mun jutska, lisää varmistuksia löytyy https://joi.dev/api/?v=17.3.0