import { generateStreamToken } from "../config/stream.js"

export const getStreamToken = async (req,res) => {
    try {
        const { user } = req.auth();
        const token = generateStreamToken(req.auth().userId);
        res.status(200).json({ token });

    } catch (error) {
        res.status(500).json({
            message : "Error in generating stream token",
        })  
    }
}