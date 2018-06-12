const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');

const UserController = require('../controllers/users.js');


router.get('/', auth, UserController.users_get_all);

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.get('/:id', UserController.get_user_details);

// ADD to PATCH requeast a request body, JSON Array of Objects with specifict key values
// [
//     {"propertyName": "alexa_layout_id", "propertyValue":"layout_0"},
//     {"propertyName": "name", "propertyValue":"Johnny"}
// ]


router.patch('/:id', UserController.update_user_info);

router.delete('/:id', UserController.delete_user);

module.exports = router;

// Promise.all([item.findById({'5b16b00b9918e5089e53572e'}), item.findByName({'Eriks'})]).then(function(values) {
//   console.log(values);
// });