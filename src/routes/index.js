const express = require('express');

const router = express.Router();


router.get('/login', async (req, res) => {
    res.render('login', { messages: {} });
});

router.get('/registro', async (req, res) => {
  res.render('registro', { messages: {} });
});


// router.get('/index', async (req, res) => {
//   const user = await req.db.collection('worker').findOne({ name: req.session.user.name });
//   res.render('index', { name: user.name });
// });

router.get('/controller', async (req, res) => {
  res.render('controller', { messages: {} }, { name: user.name });
});


router.delete('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) return next(err);
      res.redirect('/login');
  });
});

module.exports = router;