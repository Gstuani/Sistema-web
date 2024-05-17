const express = require('express');
const utils = require('applay-utils');
const router = express.Router();

//fazer registro
router.post('/registro', async (req, res) => {
  const { name, email, password, func } = req.body;
  const user = {
    name,
    email,
    password,
    func,
    permission: false,
    accessKey: 'D'
  };
  if (!name || !email || !password || !func) {
    return res.render('pages/registro', { messages: { error: 'Todos os campos são obrigatórios' }, name, func });
  } else if (password.length < 6) {
    return res.render('pages/registro', { messages: { error: 'A senha deve ter no mínimo 6 caracteres' }, name, func });
  } else {
    try {
      const userExists = await req.db.collection('authentication').findOne({ email: email });
      if (userExists) {
        return res.render('pages/registro', { messages: { error: 'Email já cadastrado' }, name, func });
      }
      await utils.insertOne(req.db, 'authentication', user);
      return res.status(200).redirect('/login', { messages: {} }, { name: user.name });
    } catch (error) {
      return res.render('pages/registro', { messages: { error: 'Erro ao salvar usuário' }, name, func });
    }
  }
});

module.exports = router;