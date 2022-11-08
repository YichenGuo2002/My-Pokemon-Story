import './db.mjs';
import {} from 'dotenv/config';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import path from 'path';
import * as auth from './auth.mjs';
import { fileURLToPath } from 'url';

const url = process.env.MONGODB_URI;
let q;

mongoose.connect(url)
    .then( () => {
        q = 'Connected to the database.';
    })
    .catch( (err) => {
        q = `Error connecting to the database. n${err}`;
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
const Pokemon = mongoose.model('Pokemon');

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

let helpers = {
    section: function(name, options){
        if(!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
    }
}

app.get('/', (req, res) => {
    res.render('index', helpers);
});

app.get('/all', (req, res) => {
    res.render('all', helpers);
});

app.get('/detail', (req, res) => {
    res.render('detail', helpers);
});

app.get('/find', (req, res) => {
    res.render('find', helpers);
});

app.get('/journey', (req, res) => {
    res.render('journey', helpers);
});

app.get('/layout', (req, res) => {
    res.render('layout', helpers);
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

app.get('/new', (req, res) => {
    res.render('new', helpers);
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
            message: registrationMessages[err.message] + err.error ?? 'Registration error. Please retry later.'
        }); 
    }
  
    console.log(req.body.firstName, req.body.lastName, req.body.email);
    // attempt to register new user
    auth.register(req.body.firstName, req.body.lastName, req.body.email, req.body.password, error, success);
});

app.get('/login', (req, res) => {
    res.render('login', {
        section: helpers.section, 
        message: q
    });
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

app.post('/list', (req, res) => {
    auth.endAuthenticatedSession (req, (err) =>{
        if(!err) {
            res.redirect('/login'); 
          } else {
            res.render('error', {
                section: helpers.section, 
                message: 'Error ending authentication session: ' + err + "."
            }); 
          }
    })
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
    let list = new List({
        user:req.session.user._id,
        title:title,
        pokemons:[]
    });
    list.save((err, listObject) =>{
        if(!err){
            req.session.user.list.push(listObject);
            res.redirect('/');
        }
        else{
            req.session.user.untitledList--;
            res.render('error', {
                section: helpers.section,
                message: 'Error creating new list: ' + err + "."
            }); 
        }
    })
})

app.listen(process.env.PORT || 3000);
