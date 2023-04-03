import jwt from "jsonwebtoken"
import {secret} from "../config.js"

const verifyJWT = async (req, res, next) => {
    // if (req.method === 'OPTIONS') {
    //     next()
    // }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) return res.status(403).json({message: 'User has not been auth'})

        const decodedData = jwt.verify(token, secret)
        console.log(decodedData)
        req.user = decodedData
        next()
    } catch (e) {
        console.log(e)
        return res.status(403).json({message: 'User has not been auth'})
    }
}

export {verifyJWT}