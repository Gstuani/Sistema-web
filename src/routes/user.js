const express = require('express');
const utils = require('applay-utils');
const router = express.Router();
const mailer = require('nodemailer');

const host = 'http://localhost:3050';

// config do email
const mailconfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  // tls: {
  //   rejectUnauthorized: false
  // },
  auth: {
    user: "bounsapoure@gmail.com" ,
    pass: "pizzariathefato"
  }
}

// função pra enviar o email
const enviaremail = async (config, options) => new Promise(resolve => {
  var transporter = mailer.createTransport(config);
  transporter.sendMail(options, function (error, info) { 
    if (error) {
      resolve(false);
    } else {
      resolve(true);
    }
  });
});


//fazer registro
router.post('/registro', async (req, res) => {
  const { name, email, password, password2, func } = req.body;
  
  const user = {
    name,
    email,
    password,
    func,
    permission: false,
    accessKey: 'D',
    token: new Date().getTime()+(1000*60*60*12)
  };
  if (!name || !email || !password || !func) {
    return res.render('pages/registro', { messages: { error: 'Todos os campos são obrigatórios' }, name, func, email });
  } else if (password.length < 6) {
    return res.render('pages/registro', { messages: { error: 'A senha deve ter no mínimo 6 caracteres' }, name, func, email });
  } else if (password !== password2) {
    return res.render('pages/registro', { messages: { error: 'As senhas não coincidem' }, name, func, email });
  } else {
    try {
      const userExists = await req.db.collection('authentication').findOne({ email: email });
      if (userExists) {
        return res.render('pages/registro', { messages: { error: 'Email já cadastrado' }, name, func, email });
      }
      await utils.insertOne(req.db, 'authentication', user);
      // link dinamico para confimação de email
      let link = `${host}/confirmacao/${user.token}`;
      // dados do email
      let mailOptions = {
        from: mailconfig.auth.user,
        to: email,
        subject: "Confirmação de Cadastro",
        html: `<h1>Olá ${name},</h1><p>Seja bem-vindo ao sistema de controle de acesso da Pizzaria Boun Sapuore.</p>
        <p>Para confirmar seu cadastro, clique no link abaixo:</p><a href="${link}">Confirmar Cadastro</a>`
      };

      let emailSent = await enviaremail(mailconfig, mailOptions);
      if (!emailSent) {
        return res.render('pages/registro', { messages: { error: 'Erro ao enviar email de confirmação' }, name, func, email });
      }

      console.log('Email enviado com sucesso')
      return res.status(200).redirect('/login', { messages: {} }, { name: user.name });
    } catch (error) {
      return res.render('pages/registro', { messages: { error: 'Erro ao salvar usuário' }, name, func, email });
    }
  }
});


// exibir confirmação de token
router.get('/confirmacao/:token', async (req, res) => {
  const { token } = req.params;
  console.log(token, "ze");
  if (!token) {
    return res.render('pages/confirmacao', { messages: { error: 'Token inválido' } });
  }
  try {
    const user = await req.db.collection('authentication').findOne({ token: parseInt(token) });
    if (!user) {
      return res.render('pages/confirmacao', { messages: { error: 'Token inválido' } });
    }
    if( parseInt(token) < new Date().getTime() ) {
      return res.render('pages/confirmacao', { messages: { error: 'Token expirado' } });
    }
    await req.db.collection('authentication').updateOne({ token: parseInt(token) }, { $set: { login: true } });
    
    return res.render('pages/confirmacao', { messages: { success: 'Cadastro confirmado com sucesso' } });
  } catch (error) {
    return res.render('pages/confirmacao', { messages: { error: 'Erro ao confirmar cadastro' } });
  }

});

// precisa receber o email da pagina do solicitar redefinir senha
// router.post('/senha1', async (req, res) => {
//   const { email, password } = req.body;
// crair token de senha
// });


// precisa confirmar oo token
// router.get('/senha2/:token', async (req, res) => {
//   const { email, password } = req.body;
// verificar o token e ir pra pagina de redefinição de senha
// });


// trocar a senha digitada
// router.post('/senha3', async (req, res) => {
// });

module.exports = router;