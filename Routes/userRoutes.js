import {Router} from 'express'
import {signup, login, getUsers} from '../Controllers/userController.js'
import {check} from "express-validator"
import {verifyJWT} from "../MW/authMW.js"

const router = Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/signup', [
    check('login', 'from 4 to 32 characters!').isLength({min: 4, max: 32}),
    check('pass', 'bigger than 8 characters!').isLength({min: 8}),
    check('name', 'bigger than 2 characters!').isLength({min: 2}),
    check('surname', 'bigger than 2 characters!').isLength({min: 2}),
    check('patronymic', 'bigger than 2 characters!').isLength({min: 2}),
    check('city', 'bigger than 2 characters!').isLength({min: 2}),
    signup])

//login route
router.post('/login', login)

router.get('/users', verifyJWT, getUsers)

export default router