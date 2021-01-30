const Vieraskirja = require('../models/vieraskirja')
const Kommentti = require('../models/kommentit')

module.exports.KirjoitaKommentti = async(req, res) => {
    //etsitään oikea merkintä vieraskirjasta
    const vieraskirja = await Vieraskirja.findById(req.params.id)
    //tehdään uusi kommentti
    const kommentti = new Kommentti(req.body.kommentit)
    kommentti.luoja = req.user._id
    //työnnetään kommentti oikeaan kohtaan vieraskirjassa
    vieraskirja.kommentit.push(kommentti)
    //tallenetaan kummatkin
    await kommentti.save()
    await vieraskirja.save()
    req.flash('onnistu', 'teit onnistuneesti uuden kommentin')
    res.redirect('/vieraskirja')
}

module.exports.poistaKommentti = async(req, res) => {
    const { id, kommenttiId} = req.params
    //pull, vedetään vieraskirjasta kommentti, jolla on kommentti id
    await Vieraskirja.findByIdAndUpdate(id, { $pull: { kommentit: kommenttiId } } )
    //etsitään kommentti ja poistetaan
    await Kommentti.findByIdAndDelete(kommenttiId)
    req.flash('onnistu', 'kommentti poistettu')
    res.redirect('/vieraskirja')
}


