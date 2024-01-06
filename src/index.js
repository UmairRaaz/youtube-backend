// require('dotenv').config({path: './env'})
import dotenv from 'dotenv'
import connectDB from './db/index.js';
import { app } from './app.js';

dotenv.config({
    path :'./.env',
})
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{console.log("Servers is running at ", process.env.PORT)})
})
.catch((err)=>console.log("MONGODB connection failed", err))



/*
import { express } from "express";
import { DB_NAME } from "./constants";
const app = express()
; (async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("ERROR", (error)=>{
            console.log("Error", error)
            throw error
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`PORT is running on: ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR: ", error)
        throw error
    }
})()
*/