const express = require('express');
const utils = require('applay-utils');
const router = express.Router();
const ensureAuthenticated = require('../middlewares/authmiddleware');


// remover permmisão de acesso


    router.delete('/index/:id', ensureAuthenticated, async (req, res) => {
      let auth = await utils.findOneAsync(req.db, 'authentication', {_id: utils.mdb.ObjectID(req.params.id)})
      auth.permission = false
      try {
        await utils.updateAsync(req.db, 'authentication', auth);
        res.status(200).redirect('/index');
      } catch (error) {
        res.status(500).render('pages/error', {error: 'Erro ao deletar a Lista de tarefas'});
      }
  })





  //adicionar permissão

  router.delete('/auth/:id', ensureAuthenticated, async (req, res) => {
    let auth = await utils.findOneAsync(req.db, 'authentication', {_id: utils.mdb.ObjectID(req.params.id)})
    auth.permission = true
    try {
      await utils.updateAsync(req.db, 'authentication', auth);
      res.status(200).redirect('/auth');
    } catch (error) {
      res.status(500).render('pages/error', {error: 'Erro ao adicionar a Lista de tarefas'});
    }
})





module.exports = router;