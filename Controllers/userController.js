import bcrypt from 'bcrypt'
import User from '../Models/userModel.js'
import {validationResult} from "express-validator"

const salt = 10

function authorized(req, login, register) {
    req.session.authorized = true
    req.session.loggined = !register
    req.session.registration = register
    req.session.login = login
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

        const username = await User.findByPk(login)
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
        }).then(() => console.log('successfully created account ' + name))
        //if user details is captured
        //generate token with the user's id and the secretKey in the env file
        // set cookie with the token generated
        if (user) {
            authorized(req, login, true)
            return res.status(201).redirect('/')
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
        const user = await User.findByPk(login)
        //if user email is found, compare password with bcrypt
        if (user) {
            if (await bcrypt.compare(pass, user.userPassword) === true) {
                //if password is the same
                //if password matches wit the one in the database
                //send user data
                authorized(req, login, false)
                console.log('loggined in ' + login)
                return res.status(200).redirect('/')
            } else return res.status(401).json({success: false, message: 'Passwords do not match'})
        } else
            return res.status(401).send("Authentication failed! This user is not exist!")
    } catch (e) {
        console.log(e)
        res.status(400).json({message: 'Login error!'})
    }
}

const deleteProfile = async (req, res) => {
    try {
        res.status(200).redirect('/exit')
        await User.destroy({where: {userLogin: req.session.login}}).then(() => {
            console.log('profile deleted ')
        })
        //return res.status(200)
    } catch
        (e) {
        console.log(e)
        res.status(400).json({message: 'delete account error!'})
    }
}

const updateProfile = async (req, res) => {
    try {
        const {city, surname, patronymic, name} = req.body
        const user = await User.findByPk(req.session.login)
        if (user) {
            await user.update({
                name: name,
                surname: surname,
                patronymic: patronymic,
                city: city
            })
                .then(() => console.log('successfully updated account ' + name))
            return res.status(200).redirect('/myProfile')
        } else return res.status(401).send('user update error!')
    } catch (e) {
        console.log(e)
        res.status(400).json({message: 'update profile error!'})
    }
}

export {signup, login, deleteProfile, updateProfile}