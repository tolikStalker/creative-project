import express from 'express'
import cookieParser from 'cookie-parser'
import db from './Models/database.js'
import authRoutes from './Routes/userRoutes.js'
import expressHandlebars from "express-handlebars"
import session from 'express-session'
import {getListenings, getListeningById, getMyListening} from "./Loaders/listenLoader.js"
import {getUser} from "./Loaders/userLoader.js"
//import path from 'path'


//const __dirname = path.resolve();

const handlebars = expressHandlebars.create({
    defaultLayout: 'main',
    extname: 'hbs',
})

//setting up port
const PORT = process.env.PORT ?? 8080

//assigning the variable app to express
const app = express()

app.engine('hbs', handlebars.engine)
app.set('view engine', 'hbs')

// using express-session
app.use(session({
    name: '_es_demo', // The name of the cookie
    secret: '1234', // The secret is required, and is used for signing cookies
    resave: false, // Force save of session for each request.
    saveUninitialized: false, // Save a session that is new, but has not been modified
    cookie: {maxAge: 120_000}
}))

//middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

//checking if connection is done
db.authenticate().then(() => console.log(`Database connected!`)).catch((err) => console.log(err))

//synchronizing the database and forcing it to false, so we don't lose data
// await db.sync({force: true}).then(() => {
//     console.log("Database has been sync with table!")
// })

// //routes for the user API
app.use('/', authRoutes)

app.get('/', async (req, res) => {
    await getListenings()
        .then(result => {
                if (result !== undefined) {
                    const context = {
                        listenings: result.map(document => {
                            return {
                                name: document.name,
                                date: document.date,
                                id: document.id,
                            }
                        })
                    }

                    res.render('index', {
                        //header: "page1/nav",
                        //title: "1231243214123",
                        //footer: "page1/footer",
                        sayHello: req.session.registration,
                        loggined: req.session.loggined,
                        listenings: context.listenings,
                        authorized: req.session.authorized,
                    })
                } else {
                    res.render('index', {
                        //header: "page1/nav",
                        //title: "1231243214123",
                        //footer: "page1/footer",
                        sayHello: req.session.registration,
                        loggined: req.session.loggined,
                        authorized: req.session.authorized,
                    })
                }
            }
        )
    delete req.session.registration
    delete req.session.loggined
})

app.get('/listening/:id', async (req, res) => {
    await getListeningById(req.params.id)
        .then(result => {
            res.render('listnening', {
                listening: result.dataValues
            })
        })
})

app.get('/exit', (req, res, next) => {
    req.session.authorized = false
    req.session.user = null
    req.session.save(err => {
        if (err) next(err)
        // regenerate the session, which is good practice to help
        // guard against forms of session fixation
        req.session.regenerate(err => {
            if (err) next(err)
            res.redirect('/')
        })
    })
})

app.get('/profile/:id', async (req, res) => {
    await getUser(req.params.id)
        .then(result => {
            res.render('viewProfile', {
                user: result.dataValues,
                authorized: req.session.authorized
            })
        })
})

app.get('/editProfile', (req, res) => {
    if (req.session.authorized)
        res.render('editProfile')
    else
        res.redirect('/auth')
})

app.get('/myListenings', async (req, res) => {
    await getMyListening(req.session.login)
        .then(result => {
            if (result !== undefined) {
                const context = {
                    listenings: result.map(document => {
                        return {
                            name: document.name,
                            date: document.date,
                            id: document.id,
                        }
                    })
                }

                res.render('myListenings', {
                    listenings: context.listenings,
                })
            } else {
                res.render('myListenings')
            }
        })
})

app.get('/reg', (req, res) => {
    res.render('registration')
})

app.get('/myProfile', (req, res) => {
    res.redirect('/profile/' + req.session.login)
})

app.get('/postListening', (req, res) => {
    res.render('postListening')
})

app.get('*', (req, res) => {
    res.status(404).render("notExistingPage")
})

//listening to server connection
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`))