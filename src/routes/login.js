const express = require('express');
const utils = require('applay-utils');
const router = express.Router();


  
//fazer login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.render('pages/login', { messages: { error: 'Todos os campos são obrigatórios' } });
    }
    const user = await req.db.collection('authentication').findOne({ email: email });
    if (!user) {
        return res.render('pages/login', { messages: { error: 'Email não encontrado' } });
    } 
    const permission = user.permission;
    if (permission === false) {
        return res.render('pages/login', { messages: { error: 'Este email não tem permissão para acessar este conteudo ' } });
    } 
    if (user.password !== password) {
        return res.render('pages/login', { messages: { error: 'Senha incorreta' } });
    }
    try {
      req.session.user = user;
      return res.status(200).redirect('/home');
    } catch (error) {
      return res.render('pages/login', { messages: { error: 'Erro ao fazer login' } });
    }
  });



module.exports = router;