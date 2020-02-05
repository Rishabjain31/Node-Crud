const _ = require('lodash');
const {User} = require('./../models/user');

const authenticate = (req, res, next) => {
    const token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        return next();

    }).catch((e) => {
        res.status(401).send();
    })
};

// const authenticateUser = (req, res, next) => {
//     const body = _.pick(req.body, ['email', 'password']);
//
//     User.findByEmailPassword(body).then((user) => {
//         if (!user) {
//             return Promise.reject();
//         }
//         req.user = user;
//         return next();
//
//     }).catch(e => {
//         res.status(401).send();
//     })
// };

module.exports = {authenticate};