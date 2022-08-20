import Video from "../models/Video.js";
import User from "../models/User.js";
import { createError } from "../middleware/errorMiddleware.js";

//CREATE A VIDEO
export const createVideo = async (req, res, next) => {
  const newVideo = await Video.create({ userId: req.user.userId, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    next(err);
  }
};

//UPDATE A VIDEO
export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    !video && next(createError(404, "Video not found"));
    if (video.userId === req.user.userId)
      return next(createError(405, "You can update your video only"));

    const updatedVideo = await Video.findByIdAndDelete(req.params.id);
    res.status(200).json(updatedVideo);
  } catch (err) {
    next(err);
  }
};

//DELETE A VIDEO
export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    !video && next(createError(404, "Video not found"));
    if (video.userId !== req.user.userId)
      return next(createError(405, "You can delete your video only"));

    await Video.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (err) {
    next(err);
  }
};

//GET A VIDEO
export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

//add A VIEW
export const addView = async (req, res, next) => {
  try {   
    await Video.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { views: 1 },
      },
      {
        new: true,
      }
    );
    res.status(200).json({ message: "View added successfully." });
  } catch (err) {
    next(err);
  }
};

//GET RANDOM VIDEOS
export const getRandomVideos = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

//GET TRENDING VIDEOS
export const getTrendingVideos = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

//GET SUSCRIBED VIDEOS
export const getSuscribedVideos = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    const suscribedChannels = user.suscribedChannels;

    const list = await Promise.all(
      suscribedChannels.map(async (channel) => {
        return await Video.find({ userId: channel });
      })
    );
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};

//GET VIDEOS BY TAGS
export const getVideosByTags = async (req, res, next) => {
  const query = req.query.tags.split(",");
  try {
    const videos = await Video.find({ tags: { $in: query } }).limit(30);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

//GET VIDEOS BY SEARCH
export const searchVideos = async (req, res, next) => {
  const query = req.query.sr;

  console.log(req.query.sr);
  try {
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).limit(30);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

//GET USER VIDEOS
export const getUserVideos = async (req, res, next) => {
  try {
    const videos = await Video.find({ userId: req.params.id });
    res.status(200).json(videos.sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};
