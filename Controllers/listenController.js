import userListing from "../Models/ListingModel.js";
import {status} from "../statusList.js";

export const addListening = async (req, res) => {
    try {
        const {name, description, price, worker_count, practice} = req.body
        const a = {
            name: name,
            status: status.start,
            owner: req.session.login,
            description: description,
            price: price,
            worker_count: worker_count,
            practice: practice
        }
        for(let key in a)
            if(a[key]==='')
                delete a[key]

        const listen = await userListing.create(a)

        await listen.save().then((listen) =>
            console.log('Created listening ' + listen.id + ' by ' + req.session.login)
        )
        //req.session.secCreated = true
        return res.status(201).redirect('/')
    } catch (e) {
        console.log(e)
        res.status(400).send('Create listening error')
    }
}

export const editListening = async (req, res) => {
    try {
        await userListing.update(req.body,
            {
                where: {id: req.body.id}
            })
            .then((listen) =>
                console.log('updated listening ' + listen.id + ' by ' + req.session.login)
            )
        return res.status(201).redirect('/')
    } catch (e) {
        console.log(e)
        res.status(400).send('Edit listening error')
    }
}

export const deleteListening = async (req, res) => {
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