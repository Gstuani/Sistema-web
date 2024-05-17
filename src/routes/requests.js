const express = require('express');
const utils = require('applay-utils');
const router = express.Router();
const ensureAuthenticated = require('../middlewares/authmiddleware');
const { ObjectId } = require('mongodb');

router.post('/sending', ensureAuthenticated, async (req, res) => {
  try {
    const requestId = req.body.requestId;
    const request = await utils.findOneAsync(req.db, 'requests', { _id: new ObjectId(requestId) });
    if (!request) {
      return res.status(404).render('pages/error', {error: 'Pedido não encontrado'});
    }
    await utils.deleteOne(req.db, 'requests', { _id: new ObjectId(requestId) });
    await utils.insertOneAsync(req.db, 'sending', request);
    res.status(200).redirect('/requests'); 
  } catch (error) {
    console.log(error);
    res.status(500).render('pages/error', {error: ''});
  }
});

router.post('/finish', ensureAuthenticated, async (req, res) => {
  try {
    const sendingId = req.body.sendingId;
    const sending = await utils.findOneAsync(req.db, 'sending', { _id: new ObjectId(sendingId) });
    if (!sending) {
      return res.status(404).render('pages/error', {error: 'Envio não encontrado'});
    }
    await utils.deleteOne(req.db, 'sending', { _id: new ObjectId(sendingId) });
    await utils.insertOneAsync(req.db, 'purchase', sending);
    res.status(200).redirect('/sending');
  } catch (error) {
    console.log(error);
    res.status(500).render('pages/error', {error: ''});
  }
});

module.exports = router;