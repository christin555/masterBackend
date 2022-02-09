const {verifyPassword, findOneByEmail, hashPassword} = require('../auth');
const knex = require('../knex/index');
const jwt = require('jsonwebtoken');
const {secretKey} = require('../config');
const {getUser} = require('../service');

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

