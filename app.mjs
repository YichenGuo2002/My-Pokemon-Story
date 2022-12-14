import './db.mjs';
import {} from 'dotenv/config';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import path from 'path';
import * as auth from './auth.mjs';
import { fileURLToPath } from 'url';

//On heroku, because we ignored .env file from committing to server, we set up environment variables on heroku dashboard config variables.
const url = process.env.MONGODB_URI;
mongoose.connect(url)
    .then( () => {
        console.log('Connected to the database.');
    })
    .catch( (err) => {
        console.log(`Error connecting to the database. ${err}`);
    });

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// The extended option allows to choose between parsing the URL-encoded data 
//with the querystring library (when false ) or the qs library (when true ). 
//The “extended” syntax allows for rich objects and arrays to be encoded into 
//the URL-encoded format, allowing for a JSON-like experience with URL-encoded.
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: "yum yum TUMS",
    resave: false,
    saveUninitialized: true,
}));
const List = mongoose.model('List');

const registrationMessages = {
    "EMAIL ALREADY EXISTS": "This email has been registered.", 
    "PASSWORD TOO SHORT": "Password must be longer than 8 characters.",
    'DOCUMENT SAVE ERROR': 'Registration error. Please retry later.'
};
const loginMessages = {
    "PASSWORDS DO NOT MATCH": 'Incorrect email or password.', 
    "USER NOT FOUND": 'User doesn\'t exist.'
};

app.use(express.static(__dirname));
app.use('public/image',express.static(__dirname +'public/image'));
app.use('public/css',express.static(__dirname +'public/css'));
app.use('views',express.static(__dirname +'views'));
app.set('view engine', 'hbs');

// add the user object to every context object for every template by using this middleware:
app.use((req, res, next) => {
    // now you can use {{user}} in your template!
    res.locals.user = req.session.user;
    next();
});

app.use(auth.authRequired(['/list']));
app.use(auth.authRequired(['/journey']));
app.use(auth.authRequired(['/new']));

const helpers = {
    section: function(name, options){
        if(!this._sections) {this._sections = {};}
        this._sections[name] = options.fn(this);
        return null;
    }
};

app.get('/', (req, res) => {
    const serviceID = `${process.env.SERVICE_ID}`;
    const templateID = `${process.env.TEMPLATE_ID}`;
    const userID = `${process.env.USER_ID}`;
    res.render('index', {
        section: helpers.section,
        service_ID: serviceID,
        template_ID:templateID,
        user_ID: userID
    });
});

app.get('/all', (req, res) => {
    res.render('all', helpers);
});

app.get('/detail', (req, res) => {
    if('user' in req.session){
        List.find({user:req.session.user._id}).sort('-createdAt').exec((err, list) => {
            res.render('detail', {
                user: req.session.user,
                list:list,
                section: helpers.section
            });
          });
    }
    else{
        res.render('detail', helpers);
    }
});

app.post('/detail', (req, res) => {
    const selectedID = req.body.list;
    const selectedPokemon = Number(req.query.pId);
    const selectedDescription = req.body.description;
    List.updateOne(
            {_id: selectedID},
            { $push: { 
                pokemons: selectedPokemon, 
                descriptions: selectedDescription 
            }}
            ).then((result) =>{
                console.log(selectedPokemon, result.title, JSON.stringify(result.pokemons));
                List.find({user:req.session.user._id}).sort('-createdAt').exec((err, list) => {
                    res.render('detail',{
                        section: helpers.section,
                        list:list,
                        message:"Successfully saved!",
                        color:"green"
                    });
                });
            }).catch((err) => {
                List.find({user:req.session.user._id}).sort('-createdAt').exec((err, list) => {
                    res.render('detail',{
                        section: helpers.section,
                        list:list,
                        message:"Hey, error" + err,
                        color:"red"
                    });
                });
            });
});

app.get('/find', (req, res) => {
    res.render('find', helpers);
});

app.get('/journey/:slug', (req, res) => {
    List.findOne({slug:req.params.slug})
    .populate('user')
    .then((result) =>{
        res.render('journey', {
            list: result,
            section: helpers.section
        });
    })
    .catch((err)=>{
      console.log(err);
      res.redirect('/');
    });
});

app.get('/layout', (req, res) => {
    res.render('layout', helpers);
});

app.get('/register', (req, res) => {
    res.render('register', helpers);
});

app.post('/register', (req, res) => {
    // setup callbacks for register success and error
    function success(newUser) {
      auth.startAuthenticatedSession(req, newUser, (err) => {
          if (!err) {
              res.redirect('/');
          } else {
              res.render('error', {
                section: helpers.section,
                message: 'Error starting authentication session: ' + err + "."
            }); 
          }
      });
    }
  
    function error(err) {
        res.render('register', {
            section: helpers.section, 
            message: registrationMessages[err.message] ?? 'Registration error. Please retry later.'
        }); 
    }
  
    console.log(req.body.firstName, req.body.lastName, req.body.email);
    // attempt to register new user
    auth.register(req.body.firstName, req.body.lastName, req.body.email, req.body.password, error, success);
});

app.get('/login', (req, res) => {
    res.render('login', helpers);
});

app.post('/login', (req, res) => {
    // setup callbacks for login success and error
    function success(user) {
      auth.startAuthenticatedSession(req, user, (err) => {
        if(!err) {
          res.redirect('/'); 
        } else {
          res.render('error', {
            section: helpers.section, 
            message: 'Error starting authentication session: ' + err + "."
        }); 
        }
      }); 
    }
  
    function error(err) {
      res.render('login', {
        section: helpers.section, 
        message: loginMessages[err.message] || 'Login unsuccessful. Please retry later.'
    }); 
    }
  
    // attempt to login
    auth.login(req.body.email, req.body.password, error, success);
});

app.get('/fyp',(req, res) => {
    res.render('fyp', helpers);
});

app.get('/list', (req, res) => {
    List.find({user:req.session.user._id}).sort('-createdAt').exec((err, list) => {
        res.render('list', {
            user: req.session.user,
            list:list,
            section: helpers.section
        });
      });
});

app.post('/list', (req, res) => {
    auth.endAuthenticatedSession(req, (err) =>{
        if(!err) {
            res.redirect('/login'); 
          } else {
            res.render('error', {
                section: helpers.section, 
                message: 'Error ending authentication session: ' + err + "."
            }); 
          }
    });
});

app.post('/addList', (req, res) =>{
    let title;
    if(req.body.listTitle){
        title = req.body.listTitle;
    }
    else{
        req.session.user.untitledList++;
        title = `My Pokémon List #${req.session.user.untitledList}`;
    }
    const list = new List({
        user:req.session.user._id,
        title:title,
        public:false,
        pokemons:[]
    });
    list.save((err, listObject) =>{
        if(!err){
            req.session.user.list.push(listObject);
            res.redirect(`journey/${listObject.slug}`);
        }
        else{
            req.session.user.untitledList--;
            res.render('error', {
                section: helpers.section,
                message: 'Error creating new list: ' + err + "."
            }); 
        }
    });
});

app.get('/map', (req, res) => {
    res.render('map', helpers);
});

app.get('/policy', (req, res) => {
    res.render('policy', helpers);
});

app.get('/terms', (req, res) => {
    res.render('terms', helpers);
});

app.listen(process.env.PORT || 3000);
