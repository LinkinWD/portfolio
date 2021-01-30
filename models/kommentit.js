const mongoose = require('mongoose')
//lyhenne scheemaan
const Schema = mongoose.Schema

const KommenttiSchema = new Schema({
    kommentti: String,
    luoja: {
        type: Schema.Types.ObjectId,
        ref: 'Käyttäjä'
    }
    })

module.exports = mongoose.model('Kommentti', KommenttiSchema)