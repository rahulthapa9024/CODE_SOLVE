require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const Problem = require("../models/problem");
const SolutionVideo = require("../models/solutionVideo");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ 1️⃣ Generate Cloudinary signature
const generateUploadSignature = async (req, res) => {
  try {
    const { problemId } = req.params;

    // Optional: userId for public_id path structure only
    const userId = req.query.userId;

    // Verify problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const publicId = `leetcode-solutions/${problemId}/${userId || 'noUser'}_${timestamp}`;

    const uploadParams = {
      timestamp,
      public_id: publicId
    };

    const signature = cloudinary.utils.api_sign_request(
      uploadParams,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      signature,
      timestamp,
      public_id: publicId,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`
    });

  } catch (error) {
    console.error('Error generating upload signature:', error);
    res.status(500).json({ error: 'Failed to generate upload credentials' });
  }
};

// ✅ 2️⃣ Save Cloudinary metadata
const saveVideoMetadata = async (req, res) => {
  try {
    const {
      problemId,
      cloudinaryPublicId,
      secureUrl,
      duration,
      userId
    } = req.body;

    // Only use userId if valid (Mongo ObjectId length is 24 chars)
    const resolvedUserId = (userId && userId.length === 24) ? userId : null;

    // Verify video exists in Cloudinary
    const cloudinaryResource = await cloudinary.api.resource(
      cloudinaryPublicId,
      { resource_type: 'video' }
    );

    if (!cloudinaryResource) {
      return res.status(400).json({ error: 'Video not found on Cloudinary' });
    }

    // Check for duplicate safely
    const query = {
      problemId,
      cloudinaryPublicId
    };
    if (resolvedUserId) query.userId = resolvedUserId;

    const existingVideo = await SolutionVideo.findOne(query);
    if (existingVideo) {
      return res.status(409).json({ error: 'Video already exists' });
    }

    const thumbnailUrl = cloudinary.image(cloudinaryResource.public_id, {
      resource_type: "video"
    });

    const videoData = {
      problemId,
      cloudinaryPublicId,
      secureUrl,
      duration: cloudinaryResource.duration || duration,
      thumbnailUrl
    };
    if (resolvedUserId) videoData.userId = resolvedUserId;

    const videoSolution = await SolutionVideo.create(videoData);

    res.status(201).json({
      message: 'Video solution saved successfully',
      videoSolution: {
        id: videoSolution._id,
        thumbnailUrl: videoSolution.thumbnailUrl,
        duration: videoSolution.duration,
        uploadedAt: videoSolution.createdAt
      }
    });

  } catch (error) {
    console.error('Error saving video metadata:', error);
    res.status(500).json({ error: 'Failed to save video metadata' });
  }
};

// ✅ 3️⃣ Delete video
const deleteVideo = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.query.userId;

    const resolvedUserId = (userId && userId.length === 24) ? userId : null;

    const query = { problemId };
    if (resolvedUserId) query.userId = resolvedUserId;

    const video = await SolutionVideo.findOneAndDelete(query);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await cloudinary.uploader.destroy(video.cloudinaryPublicId, {
      resource_type: 'video',
      invalidate: true
    });

    res.json({ message: 'Video deleted successfully' });

  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
};

module.exports = {
  generateUploadSignature,
  saveVideoMetadata,
  deleteVideo
};
