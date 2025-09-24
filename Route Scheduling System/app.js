import express from "express"
import dotenv from 'dotenv'
import mongo from 'mongoose'
import route from './routes/routeRoutes.js'
import driver from './routes/driverRoutes.js'
import schedulerRouter from './routes/schedulerRoutes.js'

const app = express();

app.use(express.json());

dotenv.config();


const PORT = process.env.PORT || 7000;


const MONGOURL = process.env.MONGODB_URI || process.env.MONGO_URL;

mongo
    .connect(MONGOURL)
    .then(() => {
        console.log("connected to DB");
        app.listen(PORT, ()=>{
            console.log(`app is running on port ${PORT}`);
        })
    })
    .catch((err) => console.log(err));

app.use('/routes', route);
app.use('/driver', driver);
app.use('/schedule', schedulerRouter);