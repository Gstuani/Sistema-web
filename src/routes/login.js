const express = require('express');
const utils = require('applay-utils');
const router = express.Router();

//fazer login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.render('pages/login', { messages: { error: 'Todos os campos são obrigatórios' }, email });
  }
  const user = await req.db.collection('authentication').findOne({ email: email });
  if (!user) {
      return res.render('pages/login', { messages: { error: 'Email não encontrado' }, email });
  } 
  const permission = user.permission;
  if (permission === false) {
      return res.render('pages/login', { messages: { error: 'Este email não tem permissão para acessar este conteudo ' }, email });
  } 
  if (user.password !== password) {
      return res.render('pages/login', { messages: { error: 'Senha incorreta' }, email });
  }
  if (user.token && !user.login) {
      return res.render('pages/login', { messages: { error: 'Confirme seu email antes de fazer login' }, email });
  }
  try {
    req.session.user = user;
    req.session.userName = user.name;
    return res.status(200).redirect('/home');
  } catch (error) {
    return res.render('pages/login', { messages: { error: 'Erro ao fazer login' }, email });
  }
});

module.exports = router;