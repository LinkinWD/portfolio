const mongoose = require('mongoose')
//lyhenne scheemaan
const Schema = mongoose.Schema

const RuokaSchema = new Schema({
    nimi: String,
    annoskoko: String,
    määrä: Number,
    hinta: Number
})

//exportattaan pohjapiirustus 'Ruoka' nimella
module.exports = mongoose.model('Ruoka', RuokaSchema)