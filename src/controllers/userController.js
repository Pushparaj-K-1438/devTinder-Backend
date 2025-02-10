const { request } = require('http');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require("fs");

// Define upload directory
const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{expiresIn:'30d'})
}

// file Handling
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,uploadDir)
    },
    filename:(req, file, cb) => {
        cb(null, Date.now()+path.extname(file.originalname));
    }
})

const upload = multer({storage});
// Register User
const registerUser = async (req, res) => {
    const {name,password,email,age,gender,skills,about} = req.body;
    if(!email || !password || !name){
        return res.status(400).send({message:'Please fill all the fields'})
    }
    const userExist = await User.findOne({email});
    if(userExist){
        return res.status(400).send({message:'User already exist'});
    } 

    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);

    const profilePhoto = req.file ? `${uploadDir}/${req.file.filename}` : null;
    const parsedSkills = Array.isArray(skills) ? skills : JSON.parse(skills);

    const newUser = await User.create({name,password:hashedPassword,email,age,gender,skills:parsedSkills,profilePhoto,about });
    if(newUser){
        const token = generateToken(newUser.id);
        res.cookie("token",token,{
            expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // HTTPS only in production
            sameSite: "strict", // Prevent CSRF attacks,
        })
        return res.status(201).send({
            name:newUser.name,
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
            expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // HTTPS only in production
            sameSite: "strict", // Prevent CSRF attacks
        })
        return res.send({
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
        return res.status(401).send({message:'Invalid Credentials'})
    }
}

// Logout
const logoutUser = async (req, res) => {
    res.cookie("token", null,{
        expires: new Date(Date.now()),
    });
    return res.send({message:'Logged out successfully'})
}


module.exports = { loginUser, registerUser, logoutUser, upload}