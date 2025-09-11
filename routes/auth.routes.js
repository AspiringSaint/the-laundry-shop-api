const router = require('express').Router();
const {
    registration,
    login,
    logout
} = require('../controllers/auth.controller');

router.post('/registration', registration);
router.post('/login', login);
router.post('/logout', logout)

module.exports = router;