const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 8,
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// UserSchema.methods.toJSON = function () {
//     const user = this;
//     const userObject = user.toObject();
//
//     return _.pick(userObject, ['_id', 'email']);
// };

UserSchema.methods.generateAuthToken = (id) => {
    const access = 'auth';
    let token = jwt.sign({_id: id.toHexString(), access}, 'secret').toString();
    return token;
};

UserSchema.statics.findByToken = async (token) => {
    let decoded;
    try {
        decoded = jwt.verify(token, 'secret');
    } catch (e) {
        return Promise.reject();
    }
    let user = await User.findOne({
        '_id': decoded._id,
    });
    const userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.findByEmailPassword = async ({email, password}) => {
    let user = await
        User.findOne({
            'email': email
        });

    let isValid;
    const userObject = user.toObject();

    isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
        return _.pick(userObject, ['_id', 'email']);
    }
    else {
        return 'Not Found';
    }
};

UserSchema.pre('save', function (next) {
    const User = this;
    if (User.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(User.password, salt, (err, hash) => {
                User.password = hash;
                next();
            })
        })
    }
    else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
