import userListing from "./Models/userListing.js";

export async function getListenings() {
    try {
        return await userListing.findAll();
    } catch (e) {
        console.log(e)
    }
}

export async function getListeningById(id) {
    try {
        return await userListing.findOne({where: {id: id}})
    } catch (e) {
        console.log(e)
    }
}