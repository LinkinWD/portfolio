require('dotenv').config()
const express = require('express')
const methodOverride = require ('method-override')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const cookies = require('cookie-parser')
const flash = require('connect-flash')
const passport = require('passport')
const LocalSctrategy = require('passport-local')
const Käyttäjä = require('./models/käyttäjät')
const dbUrl = process.env.DB_URL


const MongoDBStore = require('connect-mongo')(session)


//reitti vakiot
const vieraskirjanReitit = require('./routes/vieraskirja')
const kommenttiReitit = require('./routes/kommentit')
const ruokalanReitit = require('./routes/ruokala')
const käyttäjäReitit = require('./routes/käyttäjät')

//errorit, suojaus ja validointi
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/expressError')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const { contentSecurityPolicy } = require('helmet')

//Yhdistetään tietokantaan
// 'mongodb://localhost:27017/portfolio'
mongoose.connect(dbUrl, {
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


const store = new MongoDBStore ({
    url: dbUrl,
    secret: process.env.SECRET,
    // tää tulee sekunteina, eli jos käyttäjä ei muuta mitään tallentaa vain keran päivässä, ei turhaa tallentamista, kun käyttäjä refreshaa sivun
    touchAfter: 24 * 60 *60
})

store.on('error', function(e) {
    console.log('session errori', e)
})

//sessionit ja flash viestit
const sessionConfig = {
    //voi kirjoittaa myös store: store
    store,
    name: 'sessionska',
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        // httpOnly cookieen ei voi laittaa javascriptiä
        httpOnly: true,
        // secure: true,
        //millisekunnit * sekunnit * minuutit * tunnit
        expires: Date.now() + 1000 * 60 * 60 * 3,
        maxAge: 1000 * 60 * 60 * 3
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use(helmet({contentSecurityPolicy: false}))


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
app.use(mongoSanitize({
    replaceWith: '_'
  }))

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

/* harjoitus admin
app.get('/fakeuser', async(req, res) => {
    const user = new Käyttäjä({email: 'admin@gmail.com', username: 'admin', admin: true})
    const uusiKäyttäjä = await Käyttäjä.register(user, 'apina')
    res.send(uusiKäyttäjä)
}) */




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

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Localhost toiminnassa...')
})