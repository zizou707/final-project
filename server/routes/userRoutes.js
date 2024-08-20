const express = require('express');
const { signupUser, loginUser, findUser, getUsers } = require('../Controllers/userController');

const router = express.Router();

router.post('/signUp',signupUser)

router.get('/login/:email/:password',loginUser)

router.get('/:id', findUser)

router.get('/', getUsers)

module.exports = router;