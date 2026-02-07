const express = require('express');
const videoRouter = express.Router();

const {
  generateUploadSignature,
  saveVideoMetadata,
  deleteVideo
} = require("../controllers/videoSection");

// NO middleware — all open
videoRouter.get("/create/:problemId", generateUploadSignature);
videoRouter.post("/save", saveVideoMetadata);
videoRouter.delete("/delete/:problemId", deleteVideo);

module.exports = videoRouter;
