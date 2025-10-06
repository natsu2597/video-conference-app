import { generateStreamToken } from "../config/stream.js"

export const getStreamToken = async (req,res) => {
    try {
        const token = generateStreamToken(req.auth().userId);
        req.status(200).json({token});

    } catch (error) {
        res.status(500).json({
            message : "Error in generating stream token",
        })  
    }
}