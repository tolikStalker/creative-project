import userListing from "../Models/ListingModel.js";

const addListening = async (req, res) => {
    try {
        const {name, description, login} = req.body
        await userListing.create({
            name: name,
            desc: description,
            owner: req.session.login,
        }).then(() =>
            console.log('Successfully created listening by ' + req.session.login)
        )
        req.session.secCreated = true
        return res.status(201).redirect('/')
    } catch (e) {
        console.log(e)
        res.status(400).send('Create listening error')
    }
}

const editListening = async (req, res) => {
    try {
        const {name, description, id} = req.body
        await userListing.update({
                name: name,
                desc: description
            },
            {
                where: {id: id}
            })
        return res.status(201).redirect('/')
    } catch (e) {
        console.log(e)
        res.status(400).send('Edit listening error')
    }
}

const deleteListening = async (req, res) => {
    try {
        await userListing.destroy({where: {id: req.body.id}})
            .then(() =>
                console.log('Successfully deleted listening ' + req.body.id))
        return res.status(201).redirect('/myListenings')
    } catch (e) {
        console.log(e)
        res.status(400).send('Delete listening error')
    }
}

export {addListening, editListening, deleteListening}