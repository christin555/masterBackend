const jwt = require("jsonwebtoken");
const {secretKey} = require('../config');
const bcrypt = require("bcrypt");
const knex = require("../knex/index");

exports.verifyToken = async(req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !=='undefined'){
        const token = bearerHeader.split(' ');

        jwt.verify(token[1], secretKey,(err) =>
        {
            if (err) {
                res.sendStatus(401);
            }
            else next();
        });

    } else {
        res.sendStatus(403);
    }
};

exports.hashPassword = (password) => {
    return new Promise(function (resolve, reject) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                reject(err);
            } else {
                bcrypt.hash(password, salt, function (err, hash) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            }
        });
    });
};

exports.findOneByEmail = (email) => {
    return new Promise(function (resolve, reject) {
        knex("users").first(["password", "id"]).where("email", email)
            .then((result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject("no user found");
                }
            })
            .catch(err => reject(err));
    });
};

exports.verifyPassword = (password, hashedPassword) => {
    return new Promise(function (resolve, reject) {
        bcrypt.compare(password, hashedPassword, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};
