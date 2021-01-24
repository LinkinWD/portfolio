const express = require('express')
const methodOverride = require ('method-override')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const Vieraskirja = require('./models/vieraskirja')
const Ruoka = require('./models/ruoka')
const Kommentti = require('./models/kommentit')


//errorit ja validointi
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/expressError')
const { vieraskirjaSchema, ruokaSchema, kommentitSchema} = require('./schemas.js')

const validoiVieraskirja = (req, res, next) => {
// tämä on joi schema, ei mongoose. Se validoi ne nimet, mitkä löytyy [sisältä] inputista. Itse koodi on schemas.js
const { error }= vieraskirjaSchema.validate(req.body)
if(error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
} else {
    next()
}}
const validoiRuoka =(req, res, next) => {
    const { error} = ruokaSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }    
}
const validoiKommentti =(req, res, next) => {
    const { error} = kommentitSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }    
}


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

app.get('/vieraskirja',  catchAsync(async(req, res) => {
    //async functio, että voidaan odottaa, kun tiedot haetaa tietokannasta
    const vieraskirja = await Vieraskirja.find({}).populate('kommentit')
    console.log(vieraskirja)
    //näytetään index sivu ja lähetetään 'vieraskirjan' tiedot databasesta
    res.render('vieraskirja/index', {vieraskirja})
}))

app.get('/vieraskirja/uusi', (req, res) => {
   res.render('vieraskirja/uusi')

})
//takaisin tulevat commentit pitää parse:ta
app.post('/vieraskirja', validoiVieraskirja, catchAsync(async (req, res) => {
   // console.log(req.body) 
   const tervehdys = new Vieraskirja(req.body.vieraskirja)
   await tervehdys.save()
   res.redirect('vieraskirja')
}))

app.get('/vieraskirja/:id/edit', catchAsync(async(req, res) => {
    //etsitää id:llä vieraskirjasta
    const tervehdys = await Vieraskirja.findById(req.params.id)
    // console.log(req.params.id)
    res.render('vieraskirja/edit', { tervehdys })
}))

app.put('/vieraskirja/:id', validoiVieraskirja, catchAsync(async(req, res) => {
    // res.send('toimii!')
    const { id } = req.params
    // console.log(req.params)
    const kommentti = await Vieraskirja.findByIdAndUpdate(id, {...req.body.vieraskirja})
    // console.log(kommentti)
    res.redirect(`/vieraskirja`)
}))

app.delete('/vieraskirja/:id', catchAsync(async(req, res) => {
    const { id } = req.params
    await Vieraskirja.findByIdAndDelete(id)
    res.redirect('/vieraskirja')
}))

app.post('/vieraskirja/:id/kommentit', validoiKommentti, catchAsync(async(req, res) => {
    //etsitään oikea merkintä vieraskirjasta
    const vieraskirja = await Vieraskirja.findById(req.params.id)
    //tehdään uusi kommentti
    const kommentti = new Kommentti(req.body.kommentit)
    //työnnetään kommentti oikeaan kohtaan vieraskirjassa
    vieraskirja.kommentit.push(kommentti)
    //tallenetaan kummatkin
    await kommentti.save()
    await vieraskirja.save()
    res.redirect('/vieraskirja')
}))

app.get('/ruokala', catchAsync(async(req, res) => {
    const tuotteet = await Ruoka.find({})
    // console.log(tuotteet)
    res.render('ruokala/index', {tuotteet})
})) 

app.get('/kassa', catchAsync(async(req, res) => {
    const tuotteet = await Ruoka.find({})
    res.render('ruokala/kassa', { tuotteet})
}))

app.get('/ruokala/uusi', (req, res) => {
    res.render('ruokala/uusi')
 
 })
 //takaisin tulevat commentit pitää parse:ta
 app.post('/ruokala', validoiRuoka, catchAsync( async (req, res) => {
    // console.log(req.body)
    const ruoka = new Ruoka(req.body.ruokala)
    await ruoka.save()
    res.redirect('/kassa')
 }))

 app.delete('/ruokala/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Ruoka.findByIdAndDelete(id)
    res.redirect('/kassa')
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