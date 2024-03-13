const express = require('express');
const utils = require('applay-utils');
const router = express.Router();
const ensureAuthenticated = require('../middlewares/authmiddleware');



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
  
//page page1
  router.get('/page1', ensureAuthenticated, async (req, res) => {
    res.status(200).render('pages/page1');
  });

  //page page2
  router.get('/products', ensureAuthenticated, async (req, res) => {
    try {
      let prods = await utils.findAsync(req.db3, 'prods', {});
      res.status(200).render('pages/page2', { prods: prods});
      
    } catch (error) {
      console.log(error);
      res.status(500).render('pages/error', {error: ''});
    }
  });

  //page page3
  router.get('/page3', ensureAuthenticated, async (req, res) => {
    res.status(200).render('pages/page3');
  });
  
  //page page4
  router.get('/page4', ensureAuthenticated, async (req, res) => {
    res.status(200).render('pages/page4');
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
router.delete('/logout', async (req, res) => {
  req.session.destroy(err => {
      if (err) return next(err);
      res.redirect('/login');
  });
});

router.get('/error', (req, res) => {
  res.render('pages/error', {error: 'Erro ao acessar a página'});
});
  
module.exports = router;