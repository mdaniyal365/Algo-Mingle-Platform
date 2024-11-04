const zod = require("zod");
const Wrapper = require("../middlewares/Wrapper");
const User = require("../models/user");
const { sendMail } = require("../utils/sendMail");
const { sendResetMailWithTemplate, sendNewRegisterMail } = require("../utils/sendResetMail");


exports.signup = Wrapper(async function(req , res , next){
    const {name , email , password} = req.body;
    const schema = zod.object({
        email : zod.string().email(),
        password : zod.string().min(6),
        name : zod.string().min(1)
    })
    const response = schema.safeParse(req.body);
    if(!response.success){
        return res.status(411).json({
            msg : "Invalid Input"
        })
    }
    console.log(req.body);
    console.log("Log Recieved");
    if(!name || !email || !password){
        return res.status(400).json({
            message : "Name, email and Password are required"
        })
    }
    const checkMail = await User.findOne({email})
    if(checkMail){
        return res.status(409).json({
            message : "account with this email already exists"
        })
    }
    const user = await User.create({
        name,
        email,
        password
    })
    const token = user.getJwtToken();
    const options = {
        expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly : true
    }
    await user.save();
    sendNewRegisterMail({name , email});
    res.status(200).cookie('token' , token , options).json({
        message : "Your account has been successfully created",
        token,
        user
    })

})


exports.signin = Wrapper(async function(req , res , next){
    const {email , password} = req.body;
    const schema = zod.object({
        email : zod.string().email(),
        password : zod.string().min(6)
    })
    if(!schema.safeParse(req.body).success){
        return res.status(411).json({
            msg : "Invalid Input"
        })
    }
    console.log(req.body);
    if(!email && !password){
        return res.status(400).json({
            message : "email and password is required for login"
        })
    }

    const user = await User.findOne({email}).select("+password");
    
    if(user == null){
        return res.status(400).json({
            message : "You are not registered with us"
        })
    }
    const isVerified = await user.isValidatePassword(password);
    if(!isVerified){
        return res.status(401).json({
            message : "Incorrect password"
        })
    }
    const token = user.getJwtToken();
    res.status(200).cookie('token',token , {
        expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly : true
    }).json({
        message : "Congrats ! you are logged in. Grab the token provided",
        token,
        user
    })
})

exports.signout = Wrapper(async function(req , res , next){
    res.status(200).cookie('token' , null , {
        expires : new Date(Date.now()),
        httpOnly : true
    }).json({
        message : "You are logged out"
    })
})



exports.forgotPassword = Wrapper(async function(req , res , next){
    const {email} = req.body;
    if(!email){
        return res.status(400).json({
            message : "email is required"
        })
    }
    const user = await User.findOne({email});
    if(user == null){
        return res.status(400).json({
            message : "You are not registered with us"
        })
    }
    const forgotToken = user.getForgotPasswordToken();
    await user.save();
    console.log("Got mail " , email);
    try {
        await sendResetMailWithTemplate({
            to: email,
            resetLink : `${req.protocol}://${req.hostname}:5173/reset/password/${forgotToken}`
        })
        return res.status(200).json({
            message : "Reset mail has been send"
        })
    } catch (error) {
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        console.log(error )
        return res.status(500).json({
            message : "Something went wrong"
        })
    }

})

exports.resetPasswordCheck = Wrapper(async function(req , res , next){
    const token = req.params.token;
    const user = await User.findOne({forgotPasswordToken : token});
    if(user && user.forgotPasswordExpiry > Date.now()){
        return res.status(200).json({
            msg : "Your token is valid"
        })
    }else{
        return res.status(400).json({
            msg : "Oops ! Your token is invalid"
        })
    }
})



exports.resetPassword = Wrapper(async function(req , res, next){
    const token = req.params.token;
    const password = req.body.password;
    if(!token){
        return res.status(400).json({
            message : "Invalid request"
        })
    }
    const user = await User.findOne({
        forgotPasswordToken : token
    })
    if((user != null && user.forgotPasswordExpiry < Date.now()) || user == null){
        return res.status(400).json({
            message : "Invalid Request"
        })
    }
    if(!password){
        return res.status(400).json({
            message : "Password is required"
        })
    }
    user.password = password;
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;
    await user.save();
    res.status(200).json({
        message: "Password changed successfully"
    })
})
exports.getCurrentUser = Wrapper(async function(req , res , next){
    const user = await User.findOne({email : req.email})
    console.log("This is email " + req.email);
    res.status(200).json({
        status : "You are logged in",
        details : user
    })
})