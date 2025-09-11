const router = require('express').Router();
const {
    registration
} = require('../controllers/auth.controller');

router.post('/registration', registration);

module.exports = router;