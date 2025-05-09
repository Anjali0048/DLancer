import express, { Request, Response } from 'express';
import cors from 'cors'
import cookieParser from "cookie-parser";
import connectDB from './utils/dbConnect';
import userRoute from './routes/userRoute'
import gigRoute from './routes/gigRoute'

const app = express();
const PORT = process.env.PORT || 8080;

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
