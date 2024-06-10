const express = require('express');
const utils = require('applay-utils');
const router = express.Router();
const ensureAuthenticated = require('../middlewares/authmiddleware');
const { ObjectId } = require('mongodb');

router.post('/accept', ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.body;
    const newStatus = 'requests';
    const newStatusText = 'Em Andamento';
    const result = await req.db.collection('orders').updateOne({ _id: new ObjectId(id) }, { $set: { process: true, status: newStatus, statusText: newStatusText } });
    res.redirect('back');
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Erro ao aceitar o pedido.' });
  }
});

router.post('/recuse', ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.body;
    const newStatus = 'recused';
    const newStatusText = 'Pedido cancelado';
    const result = await req.db.collection('orders').updateOne({ _id: new ObjectId(id) }, { $set: {process: false, status: newStatus, statusText: newStatusText } });
    res.redirect('back');
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Erro ao recusar o pedido.' });
  }
});

router.post('/sending', ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.body;
    const newStatus = 'sending';
    const newStatusText = 'Enviando pedido';
    const result = await req.db.collection('orders').updateOne({ _id: new ObjectId(id) }, { $set: { status: newStatus, statusText: newStatusText } });
    res.redirect('back');
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Erro ao atualizar o status do pedido.' });
  }
});

router.post('/finish', ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.body;
    const newStatus = 'finalized';
    const newStatusText = 'Pedido finalizado';
    const result = await req.db.collection('orders').updateOne({ _id: new ObjectId(id) }, { $set: { status: newStatus, statusText: newStatusText } });
    res.redirect('back');
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Erro ao finalizar o pedido.' });
  }
});

module.exports = router;