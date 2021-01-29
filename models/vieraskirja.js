const mongoose = require('mongoose')
//lyhenne scheemaan
const Schema = mongoose.Schema
// tarvitaan että kommentit saa myös poistettua samalla, kun poistaa vieraskirja merkinnän
const Kommentti = require ('./kommentit')

const VieraskirjaSchema = new Schema({
    otsikko: String,
    kommentti: String,
    koska:
     {
        type: Date,
        default: Date.now
    },
    luoja: 
         {
        type: Schema.Types.ObjectId,
        ref: 'käyttäjä'
         },
    //Liitetään kommentit
    kommentit: [
        {
           type: Schema.Types.ObjectId,
            ref: 'Kommentti'
        }
    ]
})

//MIDDLEWARE
//deletoitu, mutta menee vielä middlewareen
VieraskirjaSchema.post('findOneAndDelete', async function(doc) {
   // console.log(doc)
   //jos jotain löytyi ja poistettiin
   if(doc) {
       //poistetaan kaikki kommentit jos niiden _id on jossain tämän vieraskinrjamerkinnän sisällä
       await Kommentti.remove({
           _id: {
               $in: doc.kommentit
           }

       }) 
       

    }} )
   


//exportattaan pohjapiirustus 'Vieraskirja' nimella
module.exports = mongoose.model('Vieraskirja', VieraskirjaSchema)