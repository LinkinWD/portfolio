const mongoose = require('mongoose')
//lyhenne scheemaan
const Schema = mongoose.Schema

const VieraskirjaSchema = new Schema({
    kirjoittaja: String,
    kommentti: String,
    koska: {
        type: Date,
        default: Date.now

}})

//exportattaan pohjapiirustus 'Vieraskirja' nimella
module.exports = mongoose.model('Vieraskirja', VieraskirjaSchema)