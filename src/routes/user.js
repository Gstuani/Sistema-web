const express = require('express');
const utils = require('applay-utils');
const router = express.Router();
const nodemailer = require('nodemailer');

const host = 'https://sistema-web.onrender.com/';
const host2 = 'http://localhost:3050/';
// Configuração do e-mail
const mailconfig = {
  host: 'smtp.titan.email',
  port: 465,
  secure: true,
  tls: {
    rejectUnauthorized: false
  },
  auth: {
    user: "pizzaria@poktoday.com",
    pass: "Gabriel.123"
  }
};

// Função para enviar o e-mail
const enviaremail = async (config, options) => new Promise((resolve, reject) => {
  const transporter = nodemailer.createTransport(config);
  transporter.sendMail(options, (error, info) => {
    if (error) {
      console.error('Erro ao enviar e-mail:', error);
      return reject(error);
    }
    resolve(info);
  });
});

// Fazer registro
router.post('/registro', async (req, res) => {
  const { name, email, password, password2, func } = req.body;
  
  const user = {
    name,
    email,
    password,
    func,
    permission: false,
    accessKey: 'D',
    token: new Date().getTime() + (1000 * 60 * 60 * 12)
  };

  if (!name || !email || !password || !func) {
    return res.render('pages/registro', { messages: { error: 'Todos os campos são obrigatórios' }, name, func, email });
  } else if (password.length < 6) {
    return res.render('pages/registro', { messages: { error: 'A senha deve ter no mínimo 6 caracteres' }, name, func, email });
  } else if (password !== password2) {
    return res.render('pages/registro', { messages: { error: 'As senhas não coincidem' }, name, func, email });
  } else {
    try {
      console.log('Verificando se o usuário já existe...');
      const userExists = await req.db.collection('authentication').findOne({ email });
      if (userExists) {
        return res.render('pages/registro', { messages: { error: 'Email já cadastrado' }, name, func, email });
      }

      console.log('Inserindo novo usuário...');
      await utils.insertOne(req.db, 'authentication', user);

      // Link dinâmico para confirmação de e-mail
      const link = `${host}confirmacao/${user.token}`;

      // Dados do e-mail
      const mailOptions = {
        from: mailconfig.auth.user,
        to: email,
        subject: "Confirmação de Cadastro",
        html: `<h1>Olá ${name},</h1><p>Seja bem-vindo ao sistema de controle de acesso da Pizzaria Boun Sapuore.</p>
        <p>Para confirmar seu cadastro, clique no link abaixo:</p><a href="${link}">Confirmar Cadastro</a>`
      };

         console.log('Enviando e-mail de confirmação...');
    await enviaremail(mailconfig, mailOptions);
    console.log('Email enviado com sucesso');

        return res.render('pages/login', { messages: { error: 'Email enviado, Por favor confirme para fazer o login' } });
  } catch (error) {
    return res.render('pages/registro', { name, func, email });
  }
  }});

// Exibir confirmação de token
router.get('/confirmacao/:token', async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.render('pages/confirmacao', { messages: { error: 'Token inválido' } });
  }

  try {
    const user = await req.db.collection('authentication').findOne({ token: parseInt(token) });

    if (!user) {
      return res.render('pages/confirmacao', { messages: { error: 'Token inválido' } });
    }

    if (parseInt(token) < new Date().getTime()) {
      return res.render('pages/confirmacao', { messages: { error: 'Token expirado' } });
    }

    await req.db.collection('authentication').updateOne({ token: parseInt(token) }, { $set: { login: true } });

    return res.render('pages/login', { messages: { success: 'Sua conta foi confirmada com sucesso. Agora você pode fazer login e começar a usar nosso serviço.' } });
  } catch (error) {
    console.error('Erro ao confirmar cadastro:', error);
    return res.render('pages/confirmacao', { messages: { error: 'Erro ao confirmar cadastro' } });
  }
});

// Rota POST '/senha1' para solicitar redefinição de senha
router.post('/senha1', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await req.db.collection('authentication').findOne({ email });
    if (!user) {
      return res.render('pages/recuperar', { messages: { error: 'E-mail não encontrado' } });
    }
    const token = Math.random().toString(36).substr(2);
    const expiry = new Date().getTime() + (60 * 60 * 1000); // 1 hora de validade
    await req.db.collection('authentication').updateOne({ email }, { $set: { resetPasswordToken: token, resetPasswordExpires: expiry } });

    const resetLink = `${host}senha/${token}`;
    // Dados do e-mail
    const mailOptions = {
      from: mailconfig.auth.user,
      to: email,
      subject: "Redefinição de Senha",
      html: `<h1>Redefinição de Senha</h1>
             <p>Você solicitou a redefinição de sua senha. Por favor, clique no link abaixo para prosseguir:</p>
             <a href="${resetLink}">Redefinir Senha</a>
             <p>Se você não solicitou isso, por favor ignore este e-mail.</p>`
    };

    await enviaremail(mailconfig, mailOptions);
    console.log('Instruções para redefinição de senha foram enviadas para o e-mail fornecido.');

    return res.render('pages/recuperar', { messages: { error: 'Instruções para redefinição de senha foram enviadas para o seu e-mail.' } });
  } catch (error) {
    console.error('Erro ao solicitar redefinição de senha:', error);
    return res.render('pages/recuperar', { messages: { error: 'Erro ao solicitar redefinição de senha' } });
  }
});

// Rota GET '/senha/:token' para verificar o token
router.get('/senha/:token', async (req, res) => {
  const { token } = req.params;
  try {
    const user = await req.db.collection('authentication').findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: new Date().getTime() } });
    if (!user) {
      return res.render('pages/senha', { estado: 'tokenInvalido', messages: { error: 'Token inválido ou expirado' } });
    }
    return res.render('pages/senha', { estado: 'redefinirSenha', token, messages: {} });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.render('pages/senha', { estado: 'tokenInvalido', messages: { error: 'Erro ao verificar token' } });
  }
});
// Rota POST '/senha3' para alterar a senha
router.post('/senha3', async (req, res) => {
  const { password, password2, token } = req.body;
  if (password !== password2) {
    return res.render('pages/senha', { messages: { error: 'As senhas não coincidem' }, token });
  }
  if (password.length < 6) {
    return res.render('pages/senha', { messages: { error: 'A nova senha deve ter pelo menos 6 caracteres' }, token });
  }
  try {
    const user = await req.db.collection('authentication').findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: new Date().getTime() } });
    if (!user) {
      return res.render('pages/senha', { messages: { error: 'Token inválido ou expirado' }, token });
    }
    
    if (password === user.password) { 
      return res.render('pages/senha', { messages: { error: 'A nova senha não pode ser igual à senha atual' }, token });
    }

    await req.db.collection('authentication').updateOne({ email: user.email }, { $set: { password: password }, $unset: { resetPasswordToken: "", resetPasswordExpires: "" } });
    return res.render('pages/login', { messages: { error: 'Senha redefinida com sucesso. Agora você pode fazer login com sua nova senha.' } });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return res.render('pages/senha', { messages: { error: 'Erro ao redefinir senha' }, token });
  }
});

router.get('/recuperar', (req, res) => {
  res.render('pages/recuperar' , { messages: {} }) ;
});



module.exports = router;
