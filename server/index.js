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
<<<<<<< HEAD

const PORT = process.env.PORT || 9000;

=======
const PORT = process.env.PORT || 9000;
>>>>>>> b8dd24cf54289cee0c5ae745974a7ada5a011da7
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
