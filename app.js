import express, {Router} from 'express'
import cookieParser from 'cookie-parser'
import db from './Models/database.js'
import authRoutes from './Routes/userRoutes.js'
import jwt from 'jsonwebtoken'
import path from 'path';
import expressHandlebars from "express-handlebars";

const __dirname = path.resolve();

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

//middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

//checking if connection is done
db.authenticate().then(() => {
    console.log(`Database connected!`)
}).catch((err) => {
    console.log(err)
})

//synchronizing the database and forcing it to false, so we don't lose data
// await db.sync({force: true}).then(() => {
//     console.log("Database has been sync with table!")
// })

// //routes for the user API
app.use('/', authRoutes)

app.get('/', (req, res) => {
    res.render( 'index',{
        header:"page1/nav",
        title:"1231243214123",
        footer:"page1/footer"
    })
})

app.get('/profile', (req, res) => {
    res.render( 'profile')
})

app.get('/reg', (req, res) => {
    res.render('registration')
    //jwt.verify()
})

app.get('*',  (req,res)=> {
    res.status(404).render("notExistingPage")
})

//listening to server connection
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`))

