import User from "../Models/userModel.js";

export async function getUser(login) {
    return await User.findByPk(login).catch(e => console.log(e))
}