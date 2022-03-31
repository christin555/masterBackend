const {verifyPassword, findOneByEmail, hashPassword} = require("../auth");
const knex = require("../knex/index");
const jwt = require("jsonwebtoken");
const {secretKey} = require('../config');
const {getUser} = require('../service/admin');

exports.register = async (req, res) => {
    const {
        name,
        email,
        password,
    } = req.body;

    if (!password || !email || !name) {
        return res.status(200).json({
            message: "tupica!"
        });
    }

    const user = {
        name,
        email,
    };
    const hashedPassword = await hashPassword(password);

    const result = await knex("users").insert({
        ...user,
        password: hashedPassword
    }).returning('id')
        .then(async ([data]) =>{
            const user = await getUser({params: {id: data}, knex});

            user.token = jwt.sign({id: data}, secretKey, {expiresIn: '24h'});

            res.status(200).json({
                message: "success! created account for new user",
                user
            });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({
                message: error.code === "23505" ? "Email is exist!" : "Error!"
            });
        });


};

exports.login = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    if (!password || !email) {
        res.status(400).json('Error');
        return res;
    }

    const user = await findOneByEmail(email)
        .then(async (result) => {
            const isVerified = await verifyPassword(password, result.password);
            if (isVerified) {
                const response = await getUser({params: {id: result.id}, knex});
                console.log(2);
                response.token = jwt.sign({id: result.id}, secretKey, {expiresIn: '24h'});
                res.status(200).json(response);
            } else {
                res.status(400).json({
                    message: "Auth is failed"
                });
            }

        }
        )
        .catch((err) => {
            console.log(err);
            return res.status(500).json({
                message: err
            });
        }
        );

    console.log(res)

    return res;
};

