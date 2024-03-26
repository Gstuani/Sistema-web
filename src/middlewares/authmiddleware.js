const express = require('express');
const utils = require('applay-utils');
const router = express.Router();



function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        const accessKey = req.session.user.accessKey;
        const route = req.path;

        // A chave 'S' tem acesso a todas as páginas
        if (accessKey === 'S') {
            return next();
        }

        const accessRules = {
            'D': ['/home', '/logout',  '/page1'],
            'C': ['/home', '/logout',  '/page1', '/page2'],
            'B': ['/home', '/logout',  '/page1', '/page2', '/page3', '/clientes'],
            'A': ['/home', '/logout',  '/page1', '/page2', '/page3', '/page4', '/clientes'],
        };

        if (accessRules[accessKey].includes(route)) {
            return next();
        } else {
            return res.redirect('/home');
        }
    } else {
        return res.redirect('/login');
    }
}

module.exports = ensureAuthenticated;