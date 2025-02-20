
import jwt from "jsonwebtoken";

const authMiddleware = async (req,res,next)=>{
    const token = req.header("Authorization");

    if(!token){
        return res.status(401).json({
            messaga:"Unauthorized"
        })
    }
    try {
        const decoded = jwt.verify(token.split(" ")[1],process.env.JWT_SECRET);
        req.user=decoded;
        next();
    } catch (error) {
        res.status(500).json({
            messaga:"Invalid token"
        })
    }
}

export default authMiddleware;