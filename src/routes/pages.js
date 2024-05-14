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

//page requests
router.get('/requests', ensureAuthenticated, async (req, res) => {
  try {
    let requests = await utils.findAsync(req.db, 'requests', {}); 
    res.status(200).render('pages/requests', { requests: requests });
  } catch (error) {
    console.log(error);
    res.status(500).render('pages/error', {error: ''});
  }
});

//page sending
router.get('/sending', ensureAuthenticated, async (req, res) => {
  try {
    let sendings = await utils.findAsync(req.db, 'sending', {}); 
    res.status(200).render('pages/sending', { sendings: sendings });
  } catch (error) {
    console.log(error);
    res.status(500).render('pages/error', {error: ''});
  }
});

//page finish
router.get('/finish', ensureAuthenticated, async (req, res) => {
  try {
    const purchase = await utils.findAsync(req.db, 'purchase', {});
    res.render('pages/finish', { purchase: purchase });
  } catch (error) {
    console.log(error);
    res.status(500).render('pages/error', {error: ''});
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
  
module.exports = router;
