import {Router} from 'express'
import {signup, login, deleteProfile, updateProfile} from '../Controllers/userController.js'
import {check} from "express-validator"
import {addListening, deleteListening, editListening} from "../Controllers/listenController.js"
import {createReview, editReview, deleteReview} from '../Controllers/reviewController.js'

const router = Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/signup', [
    check('login', 'from 4 to 32 characters!').isLength({min: 4, max: 32}),
    check('pass', 'bigger than 8 characters!').isLength({min: 8, max: 32}),
    check('name', 'bigger than 2 characters!').isLength({min: 2, max: 32}),
    check('surname', 'bigger than 2 characters!').isLength({min: 2, max: 32}),
    signup])

//login route
router.post('/login', login)

router.post('/deleteProfile', deleteProfile)

router.post('/saveProfile', [
    check('name', 'bigger than 2 characters!').isLength({min: 2, max: 32}),
    check('surname', 'bigger than 2 characters!').isLength({min: 2, max: 32}),
    check('city', 'bigger than 2 characters!').isLength({min: 2, max: 32}),
    updateProfile
])

router.post('/postListening', [
    check('name', 'longer than 2 characters and shorter 32 chars!').isLength({min: 2, max: 32}),
    addListening])

router.post('/deletePost', deleteListening)

router.post('/editPost', [
    check('name', 'from 2 to 32 characters!').isLength({min: 2, max: 32}),
    editListening])

router.post('/createReview', createReview)

router.post('/deleteReview', deleteReview)

router.post('/editReview', editReview)

export default router