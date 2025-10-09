import "../instrument.mjs";
import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { functions, inngest } from "./config/inngest.js";
import { serve } from "inngest/express";
import  chatRoutes from "./routes/chat.route.js";
import cors from "cors"

import * as Sentry from "@sentry/node";

const app = express();


app.use(express.json()); // req.body
app.use(cors({origin : ENV.CLIENT_URL, credentials : true}));
app.use(clerkMiddleware()); // req.auth
 
app.get("/debug-sentry" ,(req,res) => {
    throw new Error("My first sentry error");
})






app.get("/", (req,res) => {
    res.send("Hello world");
})

app.use("/api/inngest", serve({client : inngest, functions}));
app.use("/api/chat", chatRoutes);

Sentry.setupExpressErrorHandler(app);

const startServer = async () => {
    try{
        await connectDB();
        console.log("Connected to database");
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

startServer();

export default app;