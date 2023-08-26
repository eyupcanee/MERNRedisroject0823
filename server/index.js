import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

//APP Configrations
dotenv.config({ path: "./.env.development.local" });
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

//MONGOOSE Configrations
console.log(process.env.PORT);
const PORT = process.env.PORT || 9000;
console.log(process.env.MONGO_URL);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server PORT : ${PORT}`));
  })
  .catch((error) => {
    console.log(`Error: ${error}. Server has not connected!`);
  });
