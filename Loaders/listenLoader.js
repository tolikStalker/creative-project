import userListing from "../Models/ListingModel.js";

export async function getListenings() {
    return await userListing.findAll().catch(e => console.log(e))
}

export async function getListeningById(id) {
    return await userListing.findByPk(id).catch(e => console.log(e))
}

export async function getMyListening(login) {
    return await userListing.findAll({where: {owner: login}}).catch(e => console.log(e))
}