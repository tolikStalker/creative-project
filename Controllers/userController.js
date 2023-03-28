import bcrypt from 'bcrypt'
import User from '../Models/userModel.js'
import jwt from 'jsonwebtoken'
import {validationResult} from "express-validator";
import {secret} from "../config.js";

const salt = 10

const generateAccessToken = async (login, password) => {
    const payload = {
        login: login
    }       // не храни пароль в пейлоаде!!

    return jwt.sign(payload, secret, {expiresIn: "120s"})
}

//signing a user up
//hashing users password before its saved to the database with bcrypt
const signup = async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json('Registration error!', errors)
        }

        const {login, pass, name, surname, patronymic, city} = req.body

        const username = await User.findOne({where: {userLogin: login}})
        //if username exist in the database respond with a status of 409
        if (username) {
            return res.status(409).send("username already taken")
        }

        //saving the user
        const user = await User.create({
            userLogin: login,
            userPassword: await bcrypt.hash(pass, salt),
            name: name,
            surname: surname,
            patronymic: patronymic,
            city: city
        })
        //if user details is captured
        //generate token with the user's id and the secretKey in the env file
        // set cookie with the token generated
        if (user) {
            const token = generateAccessToken(user.userLogin, user.userPassword)

            //res.cookie("jwt", token, {maxAge: 24 * 60 * 60, httpOnly: true});
            console.log("user", JSON.stringify(user, null, 2))
            console.log(token)
            //send users details
            return res.status(201).send(user)
        } else {
            return res.status(409).send("Details are not correct")
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({message: 'Login error!'})
    }
}

//login authentication
const login = async (req, res) => {
    try {
        const {login, pass} = req.body
        //find a user by their email
        const user = await User.findOne({where: {userLogin: login}})
        //if user email is found, compare password with bcrypt
        if (user) {
            if (await bcrypt.compare(pass, user.userPassword) === true) {
                //if password is the same
                //generate token with the user's id and the secretKey in the env file
                const token = generateAccessToken(user.userLogin, user.userPassword)

                //if password matches wit the one in the database
                //go ahead and generate a cookie for the user
                res.cookie("jwt", token, {maxAge: 60 * 2, httpOnly: true});
                console.log("user", JSON.stringify(user, null, 2))
                console.log(token)
                //await getUsers()
                //send user data

                return res.redirect('/').status(200).json({success: true, message: 'Logged in!'})
            } else return res.status(401).json({success: false, message: 'Passwords do not match'})
        } else
            return res.status(401).send("Authentication failed! This user is not exist!")
    } catch (e) {
        console.log(e)
        res.status(400).json({message: 'Login error!'})
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll()
        console.log(JSON.stringify(users))
    } catch (e) {
        console.log(e)
    }
}

export {signup, login, getUsers}