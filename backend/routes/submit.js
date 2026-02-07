
const express = require('express');
const submitRouter = express.Router();

const {submitCode,runCode} = require("../controllers/userSubmission");

submitRouter.post("/submit/:id", submitCode);
submitRouter.post("/run/:id",runCode);

module.exports = submitRouter;
