import express from 'express'
import cookieParser from 'cookie-parser'
import db from './Models/database.js'
import authRoutes from './Routes/userRoutes.js'
import expressHandlebars from "express-handlebars"
import session from 'express-session'
import {getListenings, getListeningById, getMyListening} from "./Loaders/listenLoader.js"
import {getUser} from "./Loaders/userLoader.js"
//import path from 'path'
import {Server} from 'socket.io';
import {addChat, getChat} from "./Controllers/chatcontrol.js"
//import {render} from "express/lib/application.js";

//const __dirname = path.resolve();

const handlebars = expressHandlebars.create({
    defaultLayout: 'main',
    extname: 'hbs',
})

//setting up port
const PORT = process.env.PORT ?? 8080

//assigning the variable app to express
const app = express()

const server = app.listen(3000, () => {
});

const io = new Server(server);

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
            res.render('listenings/listnening', {
                listening: result.dataValues
            })
        })
})

app.get('/edit/listening/:id', async (req, res) => {
    await getListeningById(req.params.id)
        .then(result => {
            res.render('listenings/editListnening', {
                listening: result
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
            if (result == null) {
                res.render("notExistingPage.hbs")
            } else {
                for (const key in result.dataValues) {
                    if (result.dataValues[key])
                        result.dataValues[key] = result.dataValues[key].trim()
                }
                res.render('profile/viewProfile', {
                    user: result.dataValues,
                    authorized: req.session.authorized,
                    isMyProfile: req.params.id === req.session.login
                })
            }
        })

})

app.get('/edit/profile', async (req, res) => {
    if (req.session.authorized)
        await getUser(req.session.login)
            .then(result => {
                for (const key in result.dataValues) {
                    if (result.dataValues[key])
                        result.dataValues[key] = result.dataValues[key].trim()
                }
                res.render('profile/editProfile', {
                    user: result.dataValues
                })
            })
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

                res.render('listenings/myListenings', {
                    listenings: context.listenings,
                })
            } else {
                res.render('listenings/myListenings')
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
    res.render('listenings/postListening')
})

let sender;
let receiver;
io.on('connection', async(socket) => {
    console.log('user connected');

   async function  get_content() {
       socket.emit("clear");
       const content = await getChat(sender, receiver);
       if (content != null) {
           for (let i = 0; content.length > i; i += 1) {
               let msg={sender:content[i].sender,mess:content[i].message};
               socket.emit("add mess",msg);
               }
       }
   }
   async function reload(){
       setTimeout(get_content,1000);
       setTimeout(reload,5000);
   }

    setTimeout(reload,1);

    socket.on('send mess', async(msg) => {
        addChat(msg.sender,msg.receiver, msg.mess);
        socket.emit('add mess',msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});

app.use('/chat/:id', (req, res) => {
    if (req.rawHeaders[1] !== "localhost:3000") {
        res.redirect("http://localhost:3000/chat/"+(req.body.owner).toString());
    } else {
        sender=req.session.login;
        receiver=req.params.id;
        if(sender != receiver & sender!=null & receiver != null)
        {
            res.render("chat", {
                name: sender,
                receiver: receiver
            });
        }
        else{
            res.render("notExistingPage");
        }
    }
})

app.get('*', (req, res) => {
    res.status(404).render("notExistingPage")
})

//listening to server connection
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`))