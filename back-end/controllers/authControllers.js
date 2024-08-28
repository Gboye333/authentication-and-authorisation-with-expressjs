const userModel = require ('../models/UserModel');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { get_user_id} = require("../utils/helper");
const UserModel = require('../models/UserModel');

const login = async (req, res) => {
    try {
        let {username, password } = req.body
        if (!username || !password){
            return res.status(400).json({ message: "invalid Request", ok: false,})
        }

        // check if user exists
        let user = await UserModel.findOne({where: {username: username}})
        if(!user) {
            return res.status(400).json({ message: "invalid credentials", ok:false,})
        }

        //check if password is correct
        let isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.status(404).json({ message: "invalid credentials", ok:false,})
        }

        //Create Jwt token 
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                account_type: user.account_type
            }
        }

        const token = jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: "24h" })

        res.cookie("user", {
            id: user.id,
            username: user.username,
            token: token,
            account_type: user.account_type
        },  { httpOnly: true, signed: true, secure: false, maxAge: 60 * 60 * 24 * 1000 })
        return res.status(200).json({
            ok: true,
            message: "Login Successful",
            is_admin: user.account_type === "admin" ? true : false
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ messaga : "server error"});
    }
}

const logout = async (req,res) => {
 try {
    res.clearCookie("user")
    return res.status(200).json({
     ok: true,
     message: "logout successful"
    })
 } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "server error"})
 }
}

const register = async (req, res) => {
    try {
     let { username, password, email, contact_number } = req.body
     if (!username || !password || !email || !contact_number) {
        return res.status(400).json({message: "invalid Request"})
     }

     //check if user already exists
     let user = await UserModel.findOne({ where: { username: username } })

     // password Hashing
     const salt = await bcrypt.genSalt(10)
     password = await bcrypt.hash(password, salt)

     // create new user
     user = await UserModel.create({
        username: username,
        password: password,
        email: email,
        contact_number: contact_number,
        salt: salt
     })
     return res.status(200).json({ 
        message: "user created",
        ok : "true",
     })
    } catch (error) {
        return res.status(500).json({ message: "Server Error"})
    }
}

const load_user_profile = async (req,res) => {
    try {
        let user_id = await get_user_id(req) //Get user id from JWT token by the helper function

        if(!user_id){
            return res.status(400).json({ message: "invalid request", ok: "false",})
        }

        let user = await UserModel.findOne({
            where: {
                id: user_id
            },
            attributes: { exclude: ['password', 'salt']}
        }).then((user) => user.dataValues)

        if(!user) {
            return res.status(400).json({ messaga: "User not found", ok: false, })
        }
        return res.status(200).json({ payload: user, ok: true, })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server Error"})
    }
}

const update_user_profile = async (req, res) => {
try {
    let user_id = await get_user_id(req) //get user id from jwt token by the helper function

    if(!user_id) {
        return res.status.json({ messaga: "invalid request", ok:false,})
    }

    let user = await userModel.findOne({ where: { id: user_id}})

    if (!user) {
        return res.status.json({ message: "user not found", ok: false,})
    }

    let { username, email, contact_number} = req.body

    if (username) {
        user.username = username
    }
} catch (error) {
    
}
}