const _ = require('lodash');
const {User} = require('./../models/user');

exports.create = (req, res) => {
    const body = _.pick(req.body, ['userName','email', 'password']);
    const users = new User(body);

    users.save().then((resp) => {
        return users.generateAuthToken(resp && resp._id);
    }).then((token) => {
        const _userDetail = _.pick(users, ['_id', 'email']);
        res.header('x-auth', token).send(_userDetail);
    }).catch((e) => {
        res.status(400).send(e);
    })
};

exports.getUser = (req, res) => {
    res.send(req.user);
};

exports.authenticateUser = (req, res, next) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const users = new User(body);

        users.findByEmailPassword(body).then((user) => {
            if (!user) {
                return Promise.reject();
            }
            req.user = user;
            return next();

        }).catch(e => {
            res.status(401).send();
        })
    }
    catch (e) {
        res.send()
    }

};

exports.getAuthenticatedUser = (req, res) => {
    res.send(req.user);
};