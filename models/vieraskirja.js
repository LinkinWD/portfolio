const mongoose = require('mongoose')
//lyhenne scheemaan
const Schema = mongoose.Schema

const VieraskirjaSchema = new Schema({
    kirjoittaja: String,
    kommentti: String,
    koska: {
        type: Date,
        default: Date.now
    },
    kommentit: [
        {
           type: Schema.Types.ObjectId,
            ref: 'Kommentti'
        }
    ]
})

//exportattaan pohjapiirustus 'Vieraskirja' nimella
module.exports = mongoose.model('Vieraskirja', VieraskirjaSchema)