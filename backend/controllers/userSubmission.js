const jwt = require('jsonwebtoken');
const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/userSchema");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");

// Helper: verify JWT & get user
async function getUserFromToken(req, res) {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized: No token" });
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized: User not found" });
      return null;
    }
    return user;
  } catch (err) {
    res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    return null;
  }
}

// =======================
// Submit Code
// =======================
const submitCode = async (req, res) => {
  try {
    const user = await getUserFromToken(req, res);
    if (!user) return;

    const userId = user._id;
    const problemId = req.params.id;
    let { code, language } = req.body;

    if (!code || !problemId || !language) {
      return res.status(400).send("Some field missing");
    }

    if (language === 'cpp') language = 'c++';

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).send("Problem not found");
    }

    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: 'pending',
      testCasesTotal: problem.hiddenTestCases.length
    });

    const languageId = getLanguageById(language);

    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let errorMessage = null;

    for (const test of testResult) {
      if (test.status_id == 3) {
        testCasesPassed++;
        runtime += parseFloat(test.time);
        memory = Math.max(memory, test.memory);
      } else {
        status = test.status_id == 4 ? 'error' : 'wrong';
        errorMessage = test.stderr;
      }
    }

    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;

    await submittedResult.save();

    // ✅ Mark problem as solved if accepted
    if (status === 'accepted' && !user.problemSolved.includes(problemId)) {
      user.problemSolved.push(problemId);

      // ✅ Increment the right difficulty count
      const difficulty = problem.difficulty; // should be 'easy' | 'medium' | 'hard'
      if (difficulty && user.difficultyCount[difficulty] !== undefined) {
        user.difficultyCount[difficulty] += 1;
      }

      await user.save();
    }

    res.status(201).json({
      accepted: status === 'accepted',
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory
    });

  } catch (err) {
    console.error("submitCode error:", err);
    res.status(500).send("Internal Server Error " + err);
  }
};


// =======================
// Run Code
// =======================
const runCode = async (req, res) => {
  try {
    const user = await getUserFromToken(req, res);
    if (!user) return;

    const problemId = req.params.id;
    let { code, language } = req.body;

    if (!code || !problemId || !language) {
      return res.status(400).send("Some field missing");
    }

    if (language === 'cpp') language = 'c++';

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).send("Problem not found");
    }

    const languageId = getLanguageById(language);

    const submissions = problem.visibleTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = true;
    let errorMessage = null;

    for (const test of testResult) {
      if (test.status_id == 3) {
        testCasesPassed++;
        runtime += parseFloat(test.time);
        memory = Math.max(memory, test.memory);
      } else {
        status = false;
        errorMessage = test.stderr;
      }
    }

    res.status(201).json({
      success: status,
      testCases: testResult,
      runtime,
      memory,
      errorMessage
    });

  } catch (err) {
    console.error("runCode error:", err);
    res.status(500).send("Internal Server Error " + err);
  }
};

module.exports = { submitCode, runCode };
