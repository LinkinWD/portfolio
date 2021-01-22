const express = require('express')
const methodOverride = require ('method-override')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const Vieraskirja = require('./models/vieraskirja')

//Yhdistetään tietokantaan
mongoose.connect('mongodb://localhost:27017/portfolio', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on("error", console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('Yhteys tietokantaa avattu')
})


const app = express()

app.engine('ejs', ejsMate )

//Esetetaan ejs view engineksi ja sen path
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true}) )

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/vieraskirja', async(req, res) => {
    //async functio, että voidaan odottaa, kun tiedot haetaa tietokannasta
    const vieraskirja = await Vieraskirja.find({})
    console.log(vieraskirja)
    res.render('vieraskirja/index', {vieraskirja})
})

app.get('/vieraskirja/uusi', (req, res) => {
   res.render('vieraskirja/uusi')

})
//takaisin tulevat commentit pitää parse:ta
app.post('/vieraskirja', async (req, res) => {
   // console.log(req.body)
   const kommentti = new Vieraskirja(req.body.vieraskirja)
   await kommentti.save()
   res.redirect('vieraskirja')
})

app.listen(3000, () => {
    console.log('Localhost toiminnassa...')
})