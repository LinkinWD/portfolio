const Vieraskirja = require('../models/vieraskirja')

module.exports.index = async(req, res) => {
    //async functio, että voidaan odottaa, kun tiedot haetaa tietokannasta. Populatea kommentteihin, koska ne on osana vieraskirjaa ja liitetty sen pohjappiirustukseen
    const vieraskirja = await Vieraskirja.find({}).populate({
       path: 'kommentit',
        //lisätään kommentit ja niihin niiden tekijät
        populate: {
            path: 'luoja'
        }
    }).populate('luoja')
    
    // console.log(vieraskirja)
    //näytetään index sivu ja lähetetään 'vieraskirjan' tiedot databasesta
    res.render('vieraskirja/index', {vieraskirja})
}

module.exports.renderöiUusiFormi = async (req, res) => {  
    res.render('vieraskirja/uusi')
 }

 module.exports.luoUusiVieraskirjaMerkintä = async (req, res) => {
    // console.log(req.body) 
    const tervehdys = new Vieraskirja(req.body.vieraskirja)
    //Muista tää saatanan luoja liittää tähän :D
    tervehdys.luoja = req.user._id
    await tervehdys.save()
    req.flash('onnistu', 'Teit onnistuneesti uuden kirjoituksen')
    res.redirect('vieraskirja')
 }

 module.exports.renderöiMuokkaaFormi = async(req, res) => {
    //etsitää id:llä vieraskirjasta
    const { id } = req.params
    const tervehdys = await Vieraskirja.findById(id)
    // jos yrittää editoida jotain mitä ei enään ole olemassakaaan
    if(!tervehdys) {
        req.flash('error', 'Viestiä ei löydy')
        return res.redirect('/vieraskirja')
    }
    // console.log(req.params.id)
    res.render('vieraskirja/edit', { tervehdys })
}

module.exports.muokkaaMerkintää = async(req, res) => {
    // res.send('toimii!')
    const { id } = req.params
    // console.log(req.params)
    const kommentti = await Vieraskirja.findByIdAndUpdate(id, {...req.body.vieraskirja})
    req.flash('onnistu', 'päivitit onnistuneesti viestisi')
    // console.log(kommentti)
    res.redirect(`/vieraskirja`)
}

module.exports.poistaMerkintä = async(req, res) => {
    const { id } = req.params
    await Vieraskirja.findByIdAndDelete(id)
    req.flash('onnistu', 'Viesti poistettu :(')
    res.redirect('/vieraskirja')
}