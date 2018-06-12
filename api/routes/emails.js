const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth.js');

const Email = require('../models/email.js');
const User = require('../models/user.js');

// SELECT fields needed/

router.get('/', (req, res, next) => {
    Email
        .find()
        .populate('userId', 'name')
        .exec()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})




// CANT POST NEW EMAIL WITHOUT USERs ID

router.post('/', (req, res, next) => {

    User.findById(req.body.userId)
    .then(user => {
        if(!user){
            return res.status(404).json({
                message: 'User not Found'
            });
        }
        const email = new Email({
            _id: new mongoose.Types.ObjectId(),
            userId: req.body.userId,
            subject: req.body.subject,
            emailbody: req.body.emailbody
        });
        return email.save()})
            .then(result => {
                res.status(201).json({
                    message: 'Created new email'
                })
            })
            .catch(error => {
                res.status(404).json({
                    message: 'Error creating email dummie data! ( {"subject": "", "emailbody":"1"} )',
                    error: error,

            })
        });
});


module.exports = router;

// Promise.all([item.findById({'5b16b00b9918e5089e53572e'}), item.findByName({'Eriks'})]).then(function(values) {
//   console.log(values);
// });