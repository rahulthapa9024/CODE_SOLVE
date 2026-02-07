const express = require('express');

const problemRouter = express.Router();
const {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblem,
  solvedAllProblembyUser,
  submittedProblem,
} = require("../controllers/userProblem");
const getSpecificTagProblem = require("../controllers/sepcificTagProblem")

// Create
problemRouter.post("/create", createProblem);

// Update
problemRouter.put("/update/:id", updateProblem);

// Delete
problemRouter.delete("/delete/:id", deleteProblem);

// Fetch problem by ID
problemRouter.get("/problemById/:id", getProblemById);

// Fetch all problems
problemRouter.get("/getAllProblem", getAllProblem);

// Fetch all problems solved by user
problemRouter.get("/problemSolvedByUser", solvedAllProblembyUser);

// Fetch all submissions of user for a problem
problemRouter.get("/submittedProblem/:pid", submittedProblem);

problemRouter.get("/byTag/:tag",getSpecificTagProblem)

module.exports = problemRouter;
