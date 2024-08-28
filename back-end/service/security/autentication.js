const jwt = require("jsonwebtoken")
//a url-safe token is a url-safe token used for autentication and information exchange
require("dotenv").config();
const config = process.env;

const tokenVerification = (req, res, next) => {
 let token = req.body.token || req.query.token || req.headers || req.headers['x-access-token'] || req?.signedCookies?.use?.token;
 if (!token) {
    return res.status(403).send({
        auth: false,
        message: "Token is not provided",
        status: 403
    });
 }
 try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
 } catch (error) {
    console.log("failed to auntenticate token")
    return res.status(401).send({
        auth:false,
        message: "failed to authenticate",
        status: 401
    })
 }
 return next();
}

module.exports = tokenVerification;
