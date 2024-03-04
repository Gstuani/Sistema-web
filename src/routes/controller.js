const express = require('express');
const utils = require('applay-utils');
const router = express.Router();



router.get('/', async (req, res) => {
  try {
      let authentication = await utils.findAsync(req.db, 'authentication', {permission: true});
      res.status(200).render('pages/index', { authentication: authentication})
    } catch (error) {
      res.status(500).render('pages/error', {error: ''});
    }
  });


  router.delete('/:id', async (req, res) => {
    let auth = await utils.findOneAsync(req.db, 'authentication', {_id: utils.mdb.ObjectID(req.params.id)})
    auth.permission = false
    try {
      await utils.updateAsync(req.db, 'authentication', auth);
      res.redirect('/controller');
    } catch (error) {
      res.status(500).render('pages/error', {error: 'Erro ao delete a Lista de tarefas'});
    }
})


module.exports = router;
