const express = require('express');
const utils = require('applay-utils');
const router = express.Router();



function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        const accessKey = req.session.user.accessKey;
        const route = req.path;

        if (accessKey === 'S') {
            res.locals.accessKey = accessKey; 
            return next();
        }

        const accessRules = {
            'D': ['/home', '/logout', '/requests', '/process', '/accept', '/sending', '/recuse' ],
            'C': ['/home', '/logout', '/sending', '/finish', '/recuse', '/accept'],
            'B': ['/home', '/logout', '/requests', '/sending', '/finish', '/process', '/accept', '/recuse'],
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