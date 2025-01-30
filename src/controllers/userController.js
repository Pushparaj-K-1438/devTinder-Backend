const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{expiresIn:'30d'})
}
// Register User
const registerUser = async (req, res) => {
    const {name,password,email,age,gender,skills,profilePhoto,about} = req.body;
    if(!email || !password || !name){
        return res.status(400).json({message:'Please fill all the fields'})
    }
    const userExist = await User.findOne({email});
    if(userExist){
        return res.status(400).json({message:'User already exist'});
    } 

    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({name,password:hashedPassword,email,age,gender,skills,profilePhoto,about });
    if(newUser){
        return res.status(201).json({
            name:newUser.name,
            email:newUser.email,
            email:newUser.email,
            age:newUser.age,
            gender:newUser.gender,
            skills:newUser.skills,
            profilePhoto:newUser.profilePhoto,
            about:newUser.about,
            token:generateToken(newUser.id),
        })
    }
}


// Login User
const loginUser = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password))){
        const token = generateToken(user.id);
        res.cookie("token", token,{
            expires: new Date(Date.now() + 10 * 60 * 1000), // 30 days
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // HTTPS only in production
            sameSite: "strict", // Prevent CSRF attacks
        })
        return res.json({
            message:"Login successful",
            user:{
                name:user.name,
                email:user.email,
                age:user.age,
                gender:user.gender,
                skills:user.skills,
                profilePhoto:user.profilePhoto,
                about:user.about,
            }
            
        })
    }else{
        return res.status(401).json({message:'Invalid Credentials'})
    }
}


module.exports = { loginUser, registerUser}