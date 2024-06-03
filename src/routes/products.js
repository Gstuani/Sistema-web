const express = require('express');
const utils = require('applay-utils');
const router = express.Router();
const ensureAuthenticated = require('../middlewares/authmiddleware');
const ObjectId = require('mongodb').ObjectId;





// page new 
router.get('/pages/new', ensureAuthenticated, async (req, res) => {
  try {
    let pizza = {
      names: { name: '' },
      ids: { id: '' },
      estoque: true,
      price: [ '', '', '' ],   
      sizes: ['6 fatias', '8 fatias', '10 fatias']
    };
    res.status(200).render('pages/new', { pizza: pizza });
  } catch (error) {
    console.log(error);
    res.status(500).render('pages/error', {error: ''});
  }
});

// Página de edit 
router.get('/pages/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
    let prod = await req.db3.collection('prods').findOne({ _id: new ObjectId(req.params.id) });
    res.status(200).render('pages/edit', { prod: prod });
  } catch (error) {
    console.log(error);
    res.status(500).render('pages/error', {error: ''});
  }
});


// atualizar a pizza no banco de dados
router.put('/edit/:id', ensureAuthenticated, async (req, res) => {
  let { name, id, priceP, priceM, priceG, inStock, img } = req.body;

  let update = {
    _id: new ObjectId(req.params.id),
    names: { name: name },
    ids: { id: id },
    estoque: inStock === 'on' ? true : false,
    price: [priceP, priceM, priceG],
    sizes: ["6 fatias", "8 fatias", "10 fatias"],
    img: img
  };

  try {
    await utils.updateAsync(req.db3, 'prods', update);
    let prods = await utils.findAsync(req.db3, 'prods', {});
    res.status(200).render('pages/products', { prods: prods})
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao atualizar o produto');
  }
});

// Remover a pizza do banco de dados
router.delete('/pages/page2/:id', ensureAuthenticated, async (req, res) => {
    try {
      const productId = new ObjectId(req.params.id);
      await utils.deleteOne(req.db3, 'prods', { _id: productId });
      let prods = await utils.findAsync(req.db3, 'prods', {});
      res.status(200).render('pages/products', { prods: prods})
    } catch (error) {
      res.status(500).render('pages/error', { error: 'Erro ao excluir o produto.' });
    }
});



// page new 
router.post('/pages/new', ensureAuthenticated, async (req, res) => {
  const { id, name, price, img } = req.body;
  let pizza = {
    names: { name: name },
    ids: { id: id },
    estoque: true,
    price: price, 
    sizes: ['6 fatias', '8 fatias', '10 fatias'],
    img: img 
  };
  await req.db3.collection('prods').insertOne(pizza);
  let prods = await utils.findAsync(req.db3, 'prods', {});
  req.session.prods = prods; 
  res.redirect(302, '/products'); 
});








module.exports = router;