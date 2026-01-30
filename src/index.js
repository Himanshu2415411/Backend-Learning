import dotenv from "dotenv";
import connectDB from "./db/index.js";    

dotenv.config({
    path: './.env'
})

connectDB().then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
}).catch((err) => {
    console.log("Error connecting to MongoDB", err);
})



























//this can be used alternatively to connect to the DB and start the server
/*
import express from "express"
const app = express();

( async () => {
    try{
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on("error", (err) => {
            console.log("Error connecting to the server", err);
        })
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        });
    }
    catch(error){
        console.log("Error connecting to MongoDB", error);
    }
    
})()
*/