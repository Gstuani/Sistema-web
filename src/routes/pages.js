const express = require('express');
const utils = require('applay-utils');
const router = express.Router();
const ensureAuthenticated = require('../middlewares/authmiddleware');

router.get('/', (req, res) => {
  res.render('pages/registro', { messages: {} });
});

//page register
router.get('/registro', (req, res) => {
  res.render('pages/registro', { messages: {} });
});

//page login
router.get('/login', (req, res) => {
  res.render('pages/login' , { messages: {} }) ;
});


//page remove permission
router.get('/index', ensureAuthenticated, async (req, res) => {
  try {
    let authentication = await utils.findAsync(req.db, 'authentication', {permission: true});
    res.status(200).render('pages/index', { authentication: authentication})
  } catch (error) {
    res.status(500).render('pages/error', {error: ''});
  }
});

//page add permission
router.get('/auth', ensureAuthenticated, async (req, res) => {
  try {
    let authentication = await utils.findAsync(req.db, 'authentication', {permission: false});
    res.status(200).render('pages/auth', { authentication: authentication})
  } catch (error) {
    res.status(500).render('pages/error', {error: ''});
  }
});

//page home
router.get('/home', ensureAuthenticated, async (req, res) => {
  console.log('Access Key:', res.locals.accessKey);
  res.status(200).render('pages/home');
  });
  

  //page page2
  router.get('/products', ensureAuthenticated, async (req, res) => {
    try {
      let prods = await utils.findAsync(req.db3, 'prods', {});
      res.status(200).render('pages/products', { prods: prods});
      
    } catch (error) {
      console.log(error);
      res.status(500).render('pages/error', {error: ''});
    }
  });
  
  
  router.get('/process', ensureAuthenticated, async (req, res) => {
    try {
      const pedidos = await utils.findAsync(req.db, 'orders', { process: false });
      res.status(200).render('pages/process', { pedidos: pedidos });
    } catch (error) {
      console.log(error);
      res.status(500).render('pages/error', { error: '' });
    }
});

router.get('/requests', ensureAuthenticated, async (req, res) => {
    try {
      const requests = await utils.findAsync(req.db, 'orders', { status: 'requests', process: true });
      res.status(200).render('pages/requests', { requests: requests });
    } catch (error) {
      console.log(error);
      res.status(500).render('pages/error', { error: '' });
    }
});

router.get('/sending', ensureAuthenticated, async (req, res) => {
  try {
    const sendings = await utils.findAsync(req.db, 'orders', { status: 'sending', process: true });
    res.status(200).render('pages/sending', { sendings: sendings });
  } catch (error) {
    console.log(error);
    res.status(500).render('pages/error', { error: '' });
  }
});

router.get('/finish', ensureAuthenticated, async (req, res) => {
  try {
    const purchase = await utils.findAsync(req.db, 'orders', { status: 'finalized', process: true });
    res.status(200).render('pages/finish', { finished: purchase });
  } catch (error) {
    console.log(error);
    res.status(500).render('pages/error', { error: '' });
  }
});

  //page accessKey
  router.get('/accessKey', ensureAuthenticated, async (req, res) => {

    if (req.session.user.accessKey !== 'S') {
        return res.redirect('/home');
    }
    const authentication = await req.db.collection('authentication').find().toArray();
    res.status(500).render('pages/accessKey' , { authentication: authentication});
});
 
router.get('/clientes', ensureAuthenticated, async (req, res) => {
  try {
    let clientes = await utils.findAsync(req.db2, 'users', {});
    res.status(200).render('pages/clientes', { clientes: clientes})
  } catch (error) {
    res.status(500).render('pages/error', {error: ''});
  }
});


//logout
router.delete('/logout', ensureAuthenticated, async (req, res) => {
  req.session.destroy(err => {
      if (err) return next(err);
      res.redirect('/login');
  });
});

router.get('/error', ensureAuthenticated, (req, res) => {
  res.render('pages/error', {error: 'Erro ao acessar a página'});
});
  

//page contato
router.get('/contact', ensureAuthenticated, async (req, res) => {
  let mensagens = await utils.findAsync(req.db4, 'mensagens', {});
  res.render('pages/contact', { suport: { mensagens: mensagens } });
});

module.exports = router;
