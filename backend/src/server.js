import express from "express";
import { ENV } from "./config/env.js";

const app = express();

const PORT = process.env.port || 5001;

app.get("/", (req,res) => {
    res.send("Hello world");
})

app.listen(ENV.PORT, () => {
    console.log(`Server is running on port 5001      :http://localhost:${ENV.PORT}/`)
})