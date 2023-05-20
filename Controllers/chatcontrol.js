import chat from "../Models/chat.js";


export async function addChat(sender,receiver,message){
    try {
        await chat.create({
            sender: receiver,
            receiver:receiver,
            message: message,
        })
    }
    catch (e) {
        console.log(e)
    }
}


export async function getChat(sender,receiver){
    if(sender != null  && receiver != null)
    {
        try {
            return await chat.findAll({
                where: {
                    sender: [sender, receiver],
                    receiver: [receiver, sender],
                },
            });
        } catch (e) {
            console.log(e)
        }
    }
}