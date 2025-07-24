import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import deviceRoutes from "./routes/deviceRoutes.js";

dotenv.config({ quiet: true }); 
const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect DB
connectDB();

// Routes
app.use("/api/devices", deviceRoutes);

app.use('/',(req,res)=>{
    res.send('Automation backend is running')
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
