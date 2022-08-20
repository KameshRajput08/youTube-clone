import bcrypt from "bcryptjs";
import { createError } from "../middleware/errorMiddleware.js";
import User from "../models/User.js";
import Video from "../models/Video.js";
import jwt from "jsonwebtoken";

// REGISTER A USER
export const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hashedPasssword = bcrypt.hashSync(password, salt);

      const newUser = await User.create({
        username,
        email,
        password: hashedPasssword,
      });
      newUser.save();
      res.status(200).json(newUser);
    } catch (err) {
      res.status(500);
      next(err);
    }
  } else {
    next(createError(500, "User already exists"));
  }
};

//GOOGLE AUTH
export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = generateToken(user._id);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(user);
    } else {
      const newUser = await new User({
        ...req.body,
        google: true,
      });
      const savedUser = await newUser.save();
      const token = generateToken(savedUser._id);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(savedUser);
    }
  } catch (err) {
    next(err);
  }
};

// LOGIN USER
export const loginUser = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    try {
      const passwordMatched = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordMatched) {
        next(createError(500, "Password mismatch"));
      } else {
        const token = generateToken(user._id);
        const { password, ...others } = user._doc;
        res
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .status(200)
          .json(others);
      }
    } catch (err) {
      res.status(500);
      next(err);
    }
  } else {
    next(createError(404, "User not found."));
  }
};

//GET A USER
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

//UPDATE A USER
export const updateUser = async (req, res, next) => {
  if (req.params.id === req.user.userId) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    next(createError(500, "You can update your account only."));
  }
};

//DELETE A USER
export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.userId) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "User has been deleted" });
    } catch (err) {
      next(err);
    }
  } else {
    next(createError(500, "You can delete your account only."));
  }
};

//SUSCRIBE A USER
export const suscribeUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { suscribedChannels: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { suscribers: 1 },
    });
    res.status(200).json({ message: "User successfully suscribed." });
  } catch (err) {
    next(err);
  }
};

//UNSUSCRIBE A USER
export const unsuscribeUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { suscribedChannels: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { suscribers: -1 },
    });
    res.status(200).json({ message: "User successfully unsuscribed." });
  } catch (err) {
    next(err);
  }
};

//LIKE A VIDEO
export const likeVideo = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.videoId, {
      $addToSet: { likes: req.user.userId },
      $pull: { dislikes: req.user.userId },
    });
    res.status(200).json({ message: "Video successfully liked." });
  } catch (err) {
    next(err);
  }
};

//DISLIKE A VIDEO
export const dislikeVideo = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.videoId, {
      $addToSet: { dislikes: req.user.userId },
      $pull: { likes: req.user.userId },
    });
    res.status(200).json({ message: "Video successfully disliked." });
  } catch (err) {
    next(err);
  }
};

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};
