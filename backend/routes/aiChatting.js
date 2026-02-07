const express = require('express');
const aiRouter =  express.Router();

const solveDoubt = require('../controllers/solveDoubt');

aiRouter.post('/chat', solveDoubt);

module.exports = aiRouter;