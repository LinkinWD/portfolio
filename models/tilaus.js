const mongoose = require('mongoose')
//lyhenne scheemaan
const Schema = mongoose.Schema

const tilausSchema = new Schema({
    tuote: String,
    määrä: Number,
    tilaaja: {
        type: Schema.Types.ObjectId,
        ref: 'Käyttäjä'
    }
    })

module.exports = mongoose.model('Tilaus', tilausSchema)