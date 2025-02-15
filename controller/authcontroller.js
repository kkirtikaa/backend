const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');



const forget = (req, res) => {
    res.send("FORGOT Password")
}

const reset = (req, res) => {
    res.send("Reset")
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
const login = (req, res) => {
    res.send("Login")
}


module.exports = {
    signup, login, reset, forget

}