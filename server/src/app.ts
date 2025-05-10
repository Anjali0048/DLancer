import express, { Request, Response } from 'express';
import cors from 'cors'
import cookieParser from "cookie-parser";
import connectDB from './utils/dbConnect';
import userRoute from './routes/userRoute'
import gigRoute from './routes/gigRoute'
// import path from 'path';

const app = express();
const PORT = process.env.PORT || 8080;

// const distPath = path.join(__dirname, "dist");
// app.use(express.static(distPath));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("Dlancer-FYP"))

connectDB();

app.use('/api/users', userRoute)
app.use('/api/gig', gigRoute)

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
