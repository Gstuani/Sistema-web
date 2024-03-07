const express = require('express');
const utils = require('applay-utils');
const path = require('path');
const checkListRouter = require('./src/routes/checklist');
const rootRouter = require('./src/routes/index');
const methodOverride = require('method-override');


// require('./config/database');


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method', { methods: ['POST', 'GET', "PUT"]}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(async (req, res, next) => {
   var client = await utils.mdb.connectAsync('Biel', 'mongodb+srv://bielstuani:senha0@teste-0.4ww3qmx.mongodb.net/');
   req.db = client.db('test');
   next()
} )

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use('/', rootRouter);
app.use('/checklists', checkListRouter);

app.listen(3000, async () => {
   console.log('Servidor foi iniciado');
})