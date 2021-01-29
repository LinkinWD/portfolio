const Vieraskirja = require('./models/vieraskirja')
const { vieraskirjaSchema, kommentitSchema } = require('./schemas.js')
const ExpressError = require('./utils/expressError')


//tarkistetaan onkos kirjaantunut, eli onko oikeuksia, kuten myös onko luoja eli lisää oikeuksia, osa sivun sisälle joujaksi ja osa ulkopuolelle ajaxeja ja postmanejä vastaan esim.

module.exports.onKirjautunut = (req, res, next) => {
    
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Sinun tarvitsee kirjautua tehdäksesi tämän')
        return res.redirect('/login')
    }
    next()
}

//async koska joudutaan ootteleen, muista
module.exports.onLuoja = async (req,res, next) => {
    //otetaan ID urlista
    const { id } = req.params
    const vieraskirja = await Vieraskirja.findById(id)
    if(!vieraskirja.luoja.equals(req.user._id)) {
        req.flash('error', 'Sinulla ei ole oikeuksi tähän')
        //muista return middlewareissa, next jutskissa
        return  res.redirect('/vieraskirja')
    }
    next()

}

module.exports.validoiVieraskirja = (req, res, next) => {
    // tämä on joi schema, ei mongoose. Se validoi ne nimet, mitkä löytyy [sisältä] inputista. Itse koodi on schemas.js
    const { error }= vieraskirjaSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }}
module.exports.validoiKommentti =(req, res, next) => {
        const { error} = kommentitSchema.validate(req.body)
        if(error) {
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg, 400)
        } else {
            next()
        }    
    }