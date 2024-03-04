const express = require('express');
const utils = require('applay-utils');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const userRouter = require('./src/routes/user');
const controlRouter = require('./src/routes/controller');
const loginRouter = require('./src/routes/login');

const port = 3050;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method', { methods: ['POST', 'GET', "PUT"]}));


app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(async (req, res, next) => {
    var client = await utils.mdb.connectAsync('Biel', 'mongodb+srv://bielstuani:senha0@users.kybi9ip.mongodb.net/?retryWrites=true&w=majority&appName=users');
    req.db = client.db('dashboard');
    next();
});
app.engine('html', require ('ejs').renderFile);

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: '*$#*¨KWDBAvkjVKAJVkjavsfajshdbauedv(*;.;^`',
    resave: false,
    saveUninitialized: true,
  }));
  
app.use('/login', loginRouter);
app.use('/registro', userRouter);
app.use('/controller', controlRouter);

app.listen(port, async () => {
    console.log('Servidor foi iniciado');
});