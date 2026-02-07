const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");
const Problem = require("../models/problem");
const User = require("../models/userSchema");
const Submission = require("../models/submission");
const SolutionVideo = require("../models/solutionVideo");

/**
 * Create a new problem.
 * Validates reference solutions against visible test cases before saving.
 */
const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
    problemCreator, // 👈 Must come from body
  } = req.body;

  try {
    // ✅ Validate reference solutions
    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);

      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));

      const submitResult = await submitBatch(submissions);
      const resultTokens = submitResult.map((item) => item.token);
      const testResults = await submitToken(resultTokens);

      for (const test of testResults) {
        if (test.status_id !== 3) {
          return res.status(400).send("Reference solution failed some test cases.");
        }
      }
    }

    // ✅ Save problem
    const newProblem = await Problem.create({
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution,
      problemCreator: problemCreator || null, // Pass manually if needed
    });

    return res.status(201).send("Problem Saved Successfully");
  } catch (error) {
    console.error(error);
    return res.status(400).send("Error: " + (error.message || error));
  }
};

/**
 * Update existing problem by ID.
 * Validates reference solutions.
 */
const updateProblem = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).send("Missing ID Field");

  try {
    const existingProblem = await Problem.findById(id);
    if (!existingProblem) return res.status(404).send("Problem not found");

    const { referenceSolution, visibleTestCases } = req.body;

    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);

      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));

      const submitResult = await submitBatch(submissions);
      const resultTokens = submitResult.map((item) => item.token);
      const testResults = await submitToken(resultTokens);

      for (const test of testResults) {
        if (test.status_id !== 3) {
          return res.status(400).send("Reference solution failed some test cases.");
        }
      }
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      { ...req.body },
      { runValidators: true, new: true }
    );

    return res.status(200).send(updatedProblem);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error: " + (error.message || error));
  }
};

/**
 * Delete problem by ID.
 */
const deleteProblem = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("ID is Missing");

  try {
    const deleted = await Problem.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send("Problem not found");

    return res.status(200).send("Successfully Deleted");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error: " + (error.message || error));
  }
};

/**
 * Get problem by ID + solution video.
 */
const getProblemById = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("ID is Missing");

  try {
    const problem = await Problem.findById(id).select(
      "_id title description difficulty tags visibleTestCases startCode referenceSolution"
    );

    if (!problem) return res.status(404).send("Problem not found");

    const video = await SolutionVideo.findOne({ problemId: id });

    if (video) {
      return res.status(200).send({
        ...problem.toObject(),
        secureUrl: video.secureUrl,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
      });
    }

    return res.status(200).send(problem);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error: " + (error.message || error));
  }
};

/**
 * Get all problems.
 */
const getAllProblem = async (req, res) => {
  try {
    const problems = await Problem.find().select("_id title difficulty tags");
    if (!problems.length) return res.status(404).send("No problems found");

    return res.status(200).send(problems);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error: " + (error.message || error));
  }
};

/**
 * Get all problems solved by a user.
 * Pass userId as query or body param.
 */
const solvedAllProblembyUser = async (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId;
    if (!userId) return res.status(400).send("Missing userId");

    const user = await User.findById(userId).populate({
      path: "problemSolved",
      select: "_id title difficulty tags",
    });

    if (!user) return res.status(404).send("User not found");
    
    return res.status(200).send(user.problemSolved || []);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error: " + (error.message || error));
  }
};

/**
 * Get all submissions for specific problem by user.
 * Pass userId as query or body.
 */
const submittedProblem = async (req, res) => {
  try {
    const userId = req.query.userId;
    const problemId = req.params.pid;

    if (!userId) return res.status(400).send("Missing userId query param");
    if (!problemId) return res.status(400).send("Missing problemId param");

    const submissions = await Submission.find({ userId, problemId });

    return res.status(200).send(submissions || []);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error: " + (error.message || error));
  }
};

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblem,
  solvedAllProblembyUser,
  submittedProblem,
};
