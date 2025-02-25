const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
var nodemailer = require('nodemailer');


const forget =async (req, res) => {
    try {
        const {  password,email } = req.body;
        const pass=await bcyrypt.hash(password,10);
        await UserModel.findOneAndUpdate({email:email},{password:pass}).then(() => {
            console.log('password update')
        res.Status(200).json({
            message:"your password has been resent.plaese login",
        status:true
    })
    }
)
        .catch((err) =>  {
            console.log(err)
            res.status(500)
                .json({
                    message: "Internal Server Error",
                    success: false
                })
            });
        }
            catch {
                res.status(500)
                    .json({
                        message: "Internal Server Error",
                        success: false
                    })
        
            }    
    
}

const sendEmail = async(req, res) => {
    try {
        const {  email, } = req.body; 
        const user = await UserModel.findOne({ email });
    

    if (!user) {
        return res.status(404)
            .json({ message: 'User doesnot exist, please sign up',
                 success: false });
    }
        

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'skirtika00@gmail.com',
    pass: process.env.pass
  }
});
var otp =Math.floor(100000 + Math.random() * 900000);
var msg = "OTP to reset your password is:"+ otp.tostring();
console.log("Email",msg,email);
var mailOptions = {
  from: 'skirtika00@gmail.com',
  to: email,
  subject: 'password reset code',
  text: msg
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    res.Status(500).json({
        message:"internal server error",
        status:false
    })
  } else {
    console.log('Email sent: ' + info.response);
    res.Status(200).json({
        message:"email sent",
        otp: otp,
        status:true

    })
  }

});
    }
catch{
    res.status(500)
            .json({
                message: "Internal Server Error",
                success: false
            });

    }

}


const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User already exist',
                     success: false });
        }
        const userModel = new UserModel({ name, email, password });
        userModel.password = await bcrypt.hash(password, 10);

        await userModel.save();
        res.status(201)
            .json({
                message: "Signup successfully",
                success: true
            })
    }
    catch {
        res.status(500)
            .json({
                message: "Internal Server Error",
                success: false
            })

    }
}
const login = async (req, res) => {
try {
    const { email, password } = req.body;
    console.log("check",email,password);
    const user = await UserModel.findOne({ email });
    console.log("user",user);
    if (!user) {
        return res.status(404)
            .json({ message: 'User doesnot exist, please sign up',
                 success: false });
    }
    
    
    const pass = await bcrypt.compare(password,user.password);
    console.log("psw",pass);
   if(pass==false){
    res.status(403)
        .json({
            message: "invalid credential",
            success: false
        });
}
const token=jwt.sign({email:email,name:user.name},process.env.JWT_KEY,{expiresIn:'24h'})

    res.status(200)
        .json({
            message: "login sucessfully",
            success: true,
            name:user.name,
            email:user.email,
            token:token
        })
    }
        catch {
            res.status(500)
                .json({
                    message: "Internal Server Error",
                    success: false
                })
            }
    
    
}




module.exports = {
    signup, login, forget,sendEmail

}