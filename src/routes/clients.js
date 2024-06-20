const express = require('express');
const utils = require('applay-utils');
const router = express.Router();
const ensureAuthenticated = require('../middlewares/authmiddleware');
const ObjectId = require('mongodb').ObjectId;

router.delete('/clientes/:id', ensureAuthenticated, async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    await utils.deleteOne(req.db2, 'users', { _id: userId });
    let clientes = await utils.findAsync(req.db2, 'users', {});
    res.status(200).render('pages/clientes', { clientes: clientes, userName: req.session.userName})
  } catch (error) {
    res.status(500).render('pages/error', { error: 'Erro ao excluir o usuário.' });
  }
});

  module.exports = router;