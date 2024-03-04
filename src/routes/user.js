const express = require('express');
const utils = require('applay-utils');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/registro' , { messages: {} }) ;
});
  

  router.post('/', async (req, res) => {
    const { name, email, password } = req.body;
    const user = {
      name,
      email,
      password,
      permission: false
    };
    if (!name || !email || !password) {
      return res.render('pages/registro', { messages: { error: 'Todos os campos são obrigatórios' } });
    } else if (password.length < 6) {
      return res.render('pages/registro', { messages: { error: 'A senha deve ter no mínimo 6 caracteres' } });
    } else {
      try {
        const userExists = await req.db.collection('authentication').findOne({ "user.email": email });
        if (userExists) {
          return res.render('pages/registro', { messages: { error: 'Email já cadastrado' } });
        }
        await utils.insertOne(req.db, 'authentication', user);
        return res.status(200).redirect('/login');
      } catch (error) {
        return res.render('pages/registro', { messages: { error: 'Erro ao salvar usuário' } });
      }
    }
});


module.exports = router;
