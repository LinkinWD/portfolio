const express = require('express')
const methodOverride = require ('method-override')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const Vieraskirja = require('./models/vieraskirja')
const Ruoka = require('./models/ruoka')
const Kommentti = require('./models/kommentit')

const vieraskirjanReitit = require('./routes/vieraskirja')
const kommenttiReitit = require('./routes/kommentit')
const ruokalanReitit = require('./routes/ruokala')

//errorit ja validointi
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/expressError')
const { vieraskirjaSchema, ruokaSchema, kommentitSchema} = require('./schemas.js')




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

//reitit
app.use('/vieraskirja', vieraskirjanReitit)
app.use('/vieraskirja/:id/kommentit', kommenttiReitit)
app.use('/ruokala', ruokalanReitit)

app.get('/', (req, res) => {
    res.render('home')
})



app.get('/kassa', catchAsync(async(req, res) => {
    const tuotteet = await Ruoka.find({})
    res.render('ruokala/kassa', { tuotteet})
}))



//kun mikään aiempi sivu ei natsannut, tulee, sivua ei löydy
app.all('*', (req, res, next) => {
    //next työntää sen tohon alempaan error handleriin
    next(new ExpressError('Sivua ei löytynyt!', 404))
})

//error..perus erroreita, ettei serveri kaadu, löytyy utils
app.use((err, req, res ,next) => {
    const {statusCode = 500} =  err 
    if(!err.message) err.message = 'Jotain meni pieleen'
    res.status(statusCode).render('error', {err})
})

app.listen(3000, () => {
    console.log('Localhost toiminnassa...')
})