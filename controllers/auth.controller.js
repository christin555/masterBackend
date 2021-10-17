const {verifyPassword, findOneByEmail, hashPassword} = require('../auth');
const knex = require('../knex/index');
const jwt = require('jsonwebtoken');
const {secretKey} = require('../config');
const {getUser} = require('../service');

exports.register = async(req, res) => {
    const {
        firstName,
        secondName,
        lastName,
        email,
        password,
        country,
        about,
        photoPath
    } = req.body;

    if (!password || !email || !firstName || !secondName || !lastName) {
        return res.status(200).json({
            message: 'error!'
        });
    }

    const user = {
        firstName,
        secondName,
        lastName,
        email,
        country,
        about,
        photoPath
    };
    const hashedPassword = await hashPassword(password);

    const newVar = async([data]) => {
        const user = await getUser({params: {id: data}, knex});

        user.token = jwt.sign({id: data}, secretKey, {expiresIn: '24h'});

        res.status(200).json({
            message: 'success! created account for new user',
            user
        });
    };
    const onrejected = error => {
        console.log(error);
        return res.status(500).json({
            message: error.code === '23505' ? 'Email is exist!' : 'Error!'
        });
    };
    return knex('users')
        .insert({
            ...user,
            password: hashedPassword,
            isAdmin: false
        })
        .returning('id')
        .then(newVar)
        .catch(onrejected);
};

exports.login = async(req, res) => {
    const {
        email,
        password
    } = req.body;

    if (!password || !email) {
        res.status(400).json('Error');
        return res;
    }

    const onfulfilled = async(result) => {
        const isVerified = await verifyPassword(password, result.password);
        if (isVerified) {
            const response = await getUser({params: {id: result.id}, knex});
            console.log(2);
            response.token = jwt.sign({id: result.id}, secretKey, {expiresIn: '24h'});
            res.status(200).json(response);
        } else {
            res.status(400).json({
                message: 'Auth is failed'
            });
        }

    };
    const onrejected = (err) => {
        console.log(err);
        return res.status(500).json({
            message: err
        });
    };

    const user = await findOneByEmail(email)
        .then(onfulfilled)
        .catch(onrejected);

    return user;
};

