require('dotenv').config()
const express = require('express')
const methodOverride = require ('method-override')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const Ruoka = require('./models/ruoka')
const session = require('express-session')
const cookies = require('cookie-parser')
const flash = require('connect-flash')
const passport = require('passport')
const LocalSctrategy = require('passport-local')
const Käyttäjä = require('./models/käyttäjät')

//reitti vakiot
const vieraskirjanReitit = require('./routes/vieraskirja')
const kommenttiReitit = require('./routes/kommentit')
const ruokalanReitit = require('./routes/ruokala')
const käyttäjäReitit = require('./routes/käyttäjät')

//errorit ja validointi
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/expressError')

//Yhdistetään tietokantaan
mongoose.connect('mongodb://localhost:27017/portfolio', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
    
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

//sessionit ja flash viestit
const sessionConfig = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //millisekunnit * sekunnit * minuutit * tunnit
        expires: Date.now() + 1000 * 60 * 60 * 3,
        maxAge: 1000 * 60 * 60 * 3
    }
}
app.use(session(sessionConfig))
app.use(flash())

//Passport(Session pitää olla ennen tätä)
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalSctrategy(Käyttäjä.authenticate()))
//liittyy käyttäjää sessiossa ja sen jälkeen
passport.serializeUser(Käyttäjä.serializeUser())
passport.deserializeUser(Käyttäjä.deserializeUser())

//parse jutska ja asetetaan method-overrriden tunnus
app.use(express.urlencoded({ extended: true}) )
app.use(methodOverride('_method'))

//Tämä tulee olla ennen reittejä, local variables(oiskohan ne suomeksi paikalliset muuttujat :D ). Näihin pääsee kaikissa templateissa käsiksi vaikkei niitä lähetäkkään sinne. 
app.use((req, res, next) => {
    res.locals.onnistu = req.flash('onnistu')
    res.locals.error = req.flash('error')
    //passport thinggie
    // console.log(req.user)
    res.locals.käyttäjä = req.user
    next()
})

//reitit
app.use('/', käyttäjäReitit)
app.use('/vieraskirja', vieraskirjanReitit)
app.use('/vieraskirja/:id/kommentit', kommenttiReitit)
app.use('/ruokala', ruokalanReitit)

app.get('/', (req, res) => {
    res.render('home')
})

/* tee harjoitus admin
app.get('/fakeuser', async(req, res) => {
    const user = new Käyttäjä({email: 'admin@gmail.com', username: 'admin', admin: true})
    const uusiKäyttäjä = await Käyttäjä.register(user, 'apina')
    res.send(uusiKäyttäjä)
}) */

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