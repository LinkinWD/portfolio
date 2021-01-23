const express = require('express')
const methodOverride = require ('method-override')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const Vieraskirja = require('./models/vieraskirja')
const Ruoka = require('./models/ruoka')

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
app.use(express.static(path.join(__dirname, 'public')))


//parse jutska ja asetetaan method-overrriden tunnus
app.use(express.urlencoded({ extended: true}) )
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/vieraskirja', async(req, res) => {
    //async functio, että voidaan odottaa, kun tiedot haetaa tietokannasta
    const vieraskirja = await Vieraskirja.find({})
    // console.log(vieraskirja)
    //näytetään index sivu ja lähetetään 'vieraskirjan' tiedot databasesta
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

app.get('/vieraskirja/:id/edit', async (req, res) => {
    //etsitää id:llä vieraskirjasta
    const kommentti = await Vieraskirja.findById(req.params.id)
    // console.log(req.params.id)
    res.render('vieraskirja/edit', { kommentti })
})

app.put('/vieraskirja/:id', async(req, res) => {
    // res.send('toimii!')
    const { id } = req.params
    // console.log(req.params)
    const kommentti = await Vieraskirja.findByIdAndUpdate(id, {...req.body.vieraskirja})
    // console.log(kommentti)
    res.redirect(`/vieraskirja`)
})

app.delete('/vieraskirja/:id', async (req, res) => {
    const { id } = req.params
    await Vieraskirja.findByIdAndDelete(id)
    res.redirect('/vieraskirja')
})

app.get('/ruokala', async(req, res) => {
    const tuotteet = await Ruoka.find({})
    // console.log(tuotteet)
    res.render('ruokala/index', {tuotteet})
} ) 

app.get('/kassa', async(req, res) => {
    const tuotteet = await Ruoka.find({})
    res.render('ruokala/kassa', { tuotteet})
})

app.listen(3000, () => {
    console.log('Localhost toiminnassa...')
})