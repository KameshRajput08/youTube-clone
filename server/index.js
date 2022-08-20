import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import colors from "colors";
import authRoute from "./routes/auth.js";
import videoRoute from "./routes/Video.js";
import commentRoute from "./routes/Comment.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan'

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8800;

app.use(cookieParser())
app.use(cors());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("common"));

app.use('/api/auth/', authRoute)
app.use('/api/video/', videoRoute)
app.use('/api/comment/', commentRoute)

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MANGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MangoDb connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(error);
  }
};
connectDb();

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
