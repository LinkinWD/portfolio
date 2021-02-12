
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

//tää on ohi mun tajuamisen vielä, mutta lisäsin, jos tarrten myöhemmin joskus. Extension jatkaa perus joita ja tekee siihen laajennuksen, joka sisältää function 'escapeHTML', joka lisätään sellaisiin mihin voisi ehkä laittaa html tageja, eli käyttää tota sanitazehtml pakettia

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)


//serveripuolen validoitia. Ajax, postman vastaan esim.
module.exports.vieraskirjaSchema = Joi.object({
    vieraskirja: Joi.object ({
        otsikko: Joi.string().required().escapeHTML(),
        kommentti: Joi.string().required().escapeHTML()
    }).required()
})

module.exports.ruokaSchema = Joi.object({
    ruokala: Joi.object({
        nimi: Joi.string().required().escapeHTML(),
        annoskoko: Joi.string().required().escapeHTML(),
        hinta: Joi.number().required().min(0),
        määrä: Joi.number().required().min(0)
    }).required()
})

module.exports.kommentitSchema = Joi.object({
    kommentit: Joi.object({
        
        kommentti: Joi.string().required().escapeHTML()
    }).required()
})



// Käytän tässä aika hepposia, mutta on vaan mun jutska, lisää varmistuksia löytyy https://joi.dev/api/?v=17.3.0