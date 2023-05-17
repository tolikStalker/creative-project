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
    if(sender != null  & receiver != null)
    {
        try {
            const content = await chat.findAll({
                where: {
                    sender: [sender , receiver],
                    receiver: [receiver , sender],
                },
            })
            return content;
        } catch (e) {
            console.log(e)
        }
    }
}