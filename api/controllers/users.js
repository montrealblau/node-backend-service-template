const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const environmentfile = require('../../environmentfile.json');
const jwt = require('jsonwebtoken');

exports.users_get_all =  (req, res, next) => {
    User.find()
        .select('_id name alexa_layout_id help_level email password')
        .exec()
        .then(records => {

            const response = {
                count: records.length,
                users: records.map(records => {
                    return {
                        name: records.name,
                        email: records.email,
                        password: records.password,
                        alexa_layout_id: records.alexa_layout_id,
                        help_level: records.help_level,
                        _id: records._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/endpoint1/" + records._id
                        }
                    }
                })
            };

            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }

exports.user_signup = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        console.log('user length-> ',user.length);
        if (user.length >= 1) {
            return res.status(409).json({message: 'email already exists'});
        } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash,
                    name: req.body.name,
                    alexa_layout_id: req.body.alexa_layout_id,
                    help_level: req.body.help_level
                });
                user.save()
                    .then(result => {
                        res.status(201).json({
                            message: 'Created new user'
                        })
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(500).json({
                            message: 'Error creating user!',
                            error: error,

                        });
                    });
                }
            });
        }
    })
}

exports.user_login = (req, res, next) => {
     User.find({email: req.body.email})
     .exec()
     .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            if (result) {
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id,

                    },
                    environmentfile.JWT_KEY,
                    {
                        expiresIn: "100 days"
                    }
                );
                return res.status(200).json({
                    message: 'Auth successful!',
                    token: token
                });
            }
            return res.status(401).json({
                message: 'Auth failed'
            });
        });
     })
     .catch(error =>{
        console.log(error);
        res.status(500).json({
            message: 'You need to register first!',
            error: error,
        });
    });
}

exports.get_user_details = (req, res, next) => {
    const id = req.params.id;
    User.findById(id)
        .exec()
        .then(result => {
            res.status(200).json({
                message: result,
                request: {
                    description: "Send request with this id to get more info on...:",
                    type: "GET",
                    url: "http://..."
                }
            });
        })
        .catch(error => {
            console.log(error);
            res.status(404).json({
                message: 'Error finding record!',
                error: error,
            });
        });
}

exports.update_user_info = (req, res, next) => {
    const id = req.params.id;

    const propertiesToUpdate = {};

    for (const ops of req.body) {
        console.log(123);
        propertiesToUpdate[ops.propertyName] = ops.propertyValue;
    }
    User.update({ _id: id }, { $set: propertiesToUpdate })
        .exec()
        .then(response => {
            res.status(200).json({
                message: 'Updated',
                response: response
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Update failed, please provide iterable Array of objects ( [ {"propertyName": "price", "propertyValue":"55000000"}, {"propertyName": "name", "propertyValue":"John"} ] )',
                error: err
            })
        });

}

exports.delete_user = (req, res, next) => {
    const id = req.params.id;
    User.remove({
            _id: id
        }).exec()
        .then(result => {
            if (result.n === 0) {
                res.status(200).json({
                    message: 'Deleted users count: 0. User alreaddy DELETED',
                    response: result
                });
            } else {
                res.status(200).json({
                    message: 'Deleted',
                    response: result
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Couldnt DELETE user!',
                error: err
            });
        });
}