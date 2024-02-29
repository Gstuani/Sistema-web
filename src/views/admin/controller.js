const express = require('express');
const utils = require('applay-utils');
const router = express.Router();


router.get('/:id', async (req, res) => {
    try {
        let auth = await utils.findOneAsync(req.db, 'authentication', {_id: utils.mdb.ObjectID(req.params.id)})
        res.status(200).render('pasta/show', { auth: auth})
      } catch (error) {
        res.status(500).render('pages/error', {error: 'Erro ao exibir as Listas de tarefas'});
      }
    });


module.exports = router;
