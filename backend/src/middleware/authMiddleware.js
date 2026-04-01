import jwt from 'jsonwebtoken';

export const isAuthenticated = (req,res,next) =>{
const token = req.headers.authorization?.split(" ")[1]; // reads "Bearer <token>"
if (!token) return res.status(401).json({ message: "No token, unauthorized" });
  try {
req.user = jwt.verify(token, process.env.TOKEN_SECRET);
next()
        } catch (error) {
    res.status(500).json({ error: "There is some Error", message: error.message });
        }
}

export const isAdmin = (req,res,next) =>{
  
if(!req.user) return res.status(401).json({ message: "Unauthorized" })

        if((req.user.role  === "admin"))  return next()    

        return res.status(403).json({message : "UnAuthorized user"})   
               
    }

    

