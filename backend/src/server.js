import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { functions, inngest } from "./config/inngest.js";
import { serve } from "inngest/express";

const app = express();


app.use(express.json()); // req.body
app.use(clerkMiddleware()); // req.auth

app.use("/api/inngest", serve({client : inngest, functions}))

app.get("/", (req,res) => {
    res.send("Hello world");
})

const startServer = async () => {
    try{
        await connectDB();
        if(ENV.NODE_ENV !== "production") {
            app.listen(ENV.PORT, () => {
            console.log(`Server is running on port 5001      :http://localhost:${ENV.PORT}/`);
            
        })
        }
    }   
    catch(error){
        console.error("Error starting the sever", error);
        process.exit(1);
    }
}

