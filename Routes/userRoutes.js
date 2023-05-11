import {Router} from 'express'
import {signup, login, deleteProfile,updateProfile} from '../Controllers/userController.js'
import {check} from "express-validator"
import {addListening, deleteListening} from "../Controllers/listenController.js";

const router = Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/signup', [
    check('login', 'from 4 to 32 characters!').isLength({min: 4, max: 32}),
    check('pass', 'bigger than 8 characters!').isLength({min: 8, max: 32}),
    check('name', 'bigger than 2 characters!').isLength({min: 2, max: 32}),
    check('surname', 'bigger than 2 characters!').isLength({min: 2, max: 32}),
    check('patronymic', 'bigger than 2 characters!').isLength({min: 2, max: 32}),
    check('city', 'bigger than 2 characters!').isLength({min: 2, max: 32}),
    signup])

//login route
router.post('/login', login)

router.post('/postListening', [check('name', 'longer than 2 characters and shorter 32 chars!')
    .isLength({min: 2, max: 32}),
    check('description', 'longer than 2 characters and shorter 1024 chars!').isLength({min: 2, max: 1024}),
    addListening])

router.post('/deletePost', deleteListening)

router.post('/deleteProfile', deleteProfile)

router.post('/saveProfile', [
    check('name', 'bigger than 2 characters!').isLength({min: 2, max: 32}),
    check('surname', 'bigger than 2 characters!').isLength({min: 2, max: 32}),
    check('patronymic', 'bigger than 2 characters!').isLength({min: 2, max: 32}),
    check('city', 'bigger than 2 characters!').isLength({min: 2, max: 32}),
    updateProfile
])

export default router