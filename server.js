import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import dbConnect from "./config/dbConnect.js";


const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT;


dbConnect();

app.use("/api/v1/auth",authRoutes)

app.listen(PORT, () => {
  console.log(`Server is listing on PORT ${PORT}`);
});
