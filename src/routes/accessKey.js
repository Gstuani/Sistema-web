
const express = require('express');
const utils = require('applay-utils');
const router = express.Router();
const ensureAuthenticated = require('../middlewares/authmiddleware');


// alterar chave de acesso
router.post('/accessKey', ensureAuthenticated, async (req, res) => {
    if (req.session.user.accessKey !== 'S') {
        return res.redirect('/home');
    }

    try {
        const user = await req.db.collection('authentication').findOne({ _id: new utils.mdb.ObjectId(req.body.userId) });
        if (!user) {
            return res.render('pages/accessKey', { messages: { error: 'Usuário não encontrado' } });
        }
        user.accessKey = req.body.newAccessKey;
        await req.db.collection('authentication').updateOne({ _id: new utils.mdb.ObjectId(req.body.userId) }, { $set: { accessKey: user.accessKey } });
        res.redirect('/accessKey');
    } catch (error) {
        console.error(error);
        res.render('pages/accessKey', { messages: { error: 'Erro ao atualizar a chave de acesso' } });
    }
});


module.exports = router;