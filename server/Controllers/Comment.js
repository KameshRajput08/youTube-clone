import Video from "../models/Video.js";
import Comment from "../models/Comment.js";

export const comment = async (req, res, next) => {
  const newComment = await Comment.create({
    userId: req.user.userId,
    ...req.body,
  });
  try {
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  const video = await Video.findById(comment.videoId);
  if (req.user.userId === comment.userId || req.user.userId === video.userId) {
    try {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
      next(err);
    }
  } else {
    next(createError(401, "You can delete your comment only."));
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId });
    res.status(200).json(comments.sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};
