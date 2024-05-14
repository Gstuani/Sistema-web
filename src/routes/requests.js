const express = require('express');
const utils = require('applay-utils');
const router = express.Router();
const ensureAuthenticated = require('../middlewares/authmiddleware');
const server = require('http').createServer(router);
const io = require('socket.io')(server);
const { ObjectId } = require('mongodb');

router.post('/sending', ensureAuthenticated, async (req, res) => {
  try {
    const requestId = req.body.requestId; 

    if (!(/^[0-9a-fA-F]{24}$/.test(requestId))) {
      console.log('requestId is not a valid ObjectId');
      return;
    }

    const request = await utils.findOneAsync(req.db, 'requests', { _id: new ObjectId(requestId) });

    await utils.deleteOne(req.db, 'requests', { _id: new ObjectId(requestId) });

    await utils.insertOneAsync(req.db, 'sending', request);

    res.status(200).redirect('/sending');
  } catch (error) {
    console.log(error);
    res.status(500).render('pages/error', {error: ''});
  }
});

io.on('connection', (socket) => {
  socket.on('newPurchase', async () => {
    const requests = await utils.findAsync(req.db, 'requests', {}); 
    io.emit('updatePurchases', requests);
  });
});

router.post('/finish', ensureAuthenticated, async (req, res) => {
  try {
    const sendingId = req.body.sendingId;

    if (!(/^[0-9a-fA-F]{24}$/.test(sendingId))) {
      console.log('sendingId is not a valid ObjectId');
      return;
    }

    const sending = await utils.findOneAsync(req.db, 'sending', { _id: new ObjectId(sendingId) });

    await utils.deleteOne(req.db, 'sending', { _id: new ObjectId(sendingId) });

    await utils.insertOneAsync(req.db, 'purchase', sending);

    res.status(200).redirect('/finish');
  } catch (error) {
    console.log(error);
    res.status(500).render('pages/error', {error: ''});
  }
});

module.exports = router;