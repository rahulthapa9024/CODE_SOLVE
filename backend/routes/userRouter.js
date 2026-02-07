const express = require('express');
const userRouter = express.Router();

const GoogleLogin = require("../controllers/GoogleLogin.js");
userRouter.post("/googleLogin", GoogleLogin);

const{sendOtp} = require("../controllers/sendOTP.js");
userRouter.post("/generateOTP", sendOtp);

const verifyOtp = require("../controllers/verifyOTP.js.js")
userRouter.post("/verifyOtp",verifyOtp)

const searchProfile = require("../controllers/searchProfile.js")
userRouter.get("/searchProfile",searchProfile)

const check = require("../controllers/check.js");
userRouter.get("/check", check);

const logout = require("../controllers/logout.js");
userRouter.post("/logout", logout);

const getImage = require("../controllers/getUserImage.js");
userRouter.get("/getImage", getImage);

const getDifficultyCount = require("../controllers/getDifficultyCount.js");
userRouter.get("/getDifficultyCount", getDifficultyCount);

const UserSolvedProblem = require("../controllers/UserSolvedProblems.js");
userRouter.get("/userSolvedProblems", UserSolvedProblem);

module.exports = userRouter;
