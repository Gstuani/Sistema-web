const express = require('express');
const utils = require('applay-utils');
const router = express.Router();



function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        const accessKey = req.session.user.accessKey;
        const route = req.path;

        // A chave 'S' tem acesso a todas as páginas
        if (accessKey === 'S') {
            res.locals.accessKey = accessKey; 
            return next();
        }

        const accessRules = {
            'D': ['/home', '/logout', '/requests'],
            'C': ['/home', '/logout', '/sending'],
            'B': ['/home', '/logout', '/requests', '/sending', '/finish'],
            'A': ['/home', '/logout', '/clientes', '/contact'],
        };

        if (accessRules[accessKey].includes(route)) {
            res.locals.accessKey = accessKey;
            return next();
        }else {
            return res.redirect('/home');
        }
    } else {
        return res.redirect('/login');
    }
}

module.exports = ensureAuthenticated;