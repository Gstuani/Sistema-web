const express = require('express');
const utils = require('applay-utils');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const userRouter = require('./src/routes/user');
const loginRouter = require('./src/routes/login');
const funcRouter = require('./src/routes/func');
const accessRouter = require('./src/routes/accessKey');
const clientsRouter = require('./src/routes/clients');
const pagesRouter = require('./src/routes/pages');
const productsRouter = require('./src/routes/products');
const requestsRouter = require('./src/routes/requests');
const http = require('http');
const socketio = require('socket.io');


const port = process.env.PORT || 3050;
const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method', { methods: ['POST', 'GET', "PUT"]}));


app.use('/public', express.static(path.join(__dirname, 'public')));
let client;
let db;
app.use(async (req, res, next) => {
  if (!client) {
      client = await utils.mdb.connectAsync('Biel', 'mongodb+srv://bielstuani:senha0@users.kybi9ip.mongodb.net/?retryWrites=true&w=majority&appName=users');
  }
  req.db = client.db('dashboard');
  req.db2 = client.db('client');
  req.db3 = client.db('products');
  req.db4 = client.db('suport');

  if (!io.hasListeners('connection')) {
    io.on('connection', (socket) => {
        socket.on('newOrder', async () => {
            const requests = await utils.findAsync(req.db, 'requests', {}); 
            io.emit('updateOrders', requests);
        });
    });
  }

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


app.use('/', loginRouter);
app.use('/', userRouter);
app.use('/', funcRouter);
app.use('/', accessRouter);
app.use('/', clientsRouter);
app.use('/', pagesRouter);
app.use('/', productsRouter);
app.use('/', requestsRouter);


server.listen(port, async () => {
    console.log('Servidor foi iniciado');
});
