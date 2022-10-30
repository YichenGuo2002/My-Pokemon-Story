import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));
app.use('public/image',express.static(__dirname +'public/image'));
app.use('public/css',express.static(__dirname +'public/css'));
app.use('views',express.static(__dirname +'views'));
app.set('view engine', 'hbs');

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
    res.render('list', helpers);
});

app.get('/login', (req, res) => {
    res.render('login', helpers);
});

app.get('/new', (req, res) => {
    res.render('new', helpers);
});

app.get('/register', (req, res) => {
    res.render('register', helpers);
});

app.listen(process.env.PORT || 3000);
