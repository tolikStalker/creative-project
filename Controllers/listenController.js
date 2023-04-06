import userListing from "../Models/userListing.js";

const addListening = async (req, res) => {
    try {
        const {name, description, login} = req.body
        await userListing.create({
            name: name,
            desc: description,
            owner: req.session.login,
        })
        req.session.secCreated = true
        return res.status(201).redirect('/')
    } catch (e) {
        console.log(e)
        res.status(400).send('error')
    }
}

const editListening = async () => {

}

const deleteListening = async (req, res) => {
    try {
        await userListing.destroy({where: {id: req.body.id}})
        return res.status(201).redirect('/myListenings')
    } catch (e) {
        console.log(e)
        res.status(400).send('Delete error!')
    }
}

export {addListening, editListening, deleteListening}