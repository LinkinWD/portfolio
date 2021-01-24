const mongoose = require('mongoose')
//lyhenne scheemaan
const Schema = mongoose.Schema

const KommenttiSchema = new Schema({
    kirjoittaja: String,
    kommentti: String,
    })

module.exports = mongoose.model('Kommentti', KommenttiSchema)