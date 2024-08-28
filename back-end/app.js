"use strict"; //enables strict mode in javascript, which helps catch common coding mistakes and prevent certain actions that are considered unsafe..
const bodyParser = require("body-parser"); //imports body parser middle ware,  which helps parse body incoming request 
//(like json data) so your server can use the data, it makes it easy for the server to interpret incoming data and not get "undefined".
const cookieParser = require("cookie-parser");// cookies are a small piece of data stored on the client(user) device
//and are sent back to the server on each request, they are used for users session, for security purpose, like login and logout purpose, 
//to remember users prference also  
require("dotenv").config();
// loads the code from the enviroment variable ".env" file tho the to the 'process.env'
const express = require("express");
// popular framework for building web application and APIS
const morgan = require("morgan");
// logging tool that pro vide detailed information about https request made to your server
const cors = require("cors");
// import cors middleware, which enables cross origin resouce sharing, allow your server to handle request from different domains.
// security feature implemented by web browser to prevent malicious website from making request to a different domain than the one 
// that is meant to serve the web page, the browser will block the request from different port, when you have different port for 
// the backend and the front end
const app = express();
const PORT = process.env.PORT | 4001;
//sets the ports of the server you listen on, tries to use port defined in the enviroment variables
app.use(morgan("tiny"));
// logs minimal message from the https request
const corsOptions = {
  origin: true, // allows request from any origin
  credentials: true, //allows cookies and autentication info to be sent
  preflightContinue: true, //A preflight CORS request is a preliminary request sent 
  //by a web browser to determine if the actual request can be made to a different origin 
  // (domain) before the browser actually sends the main request.
};
app.use(cors(corsOptions));
//apply corOptions with the options from above 
app.use(cookieParser(process.env.TOKEN_KEY));
// applies the cookie parser middleware which will parse cookies using the token store in the "process.env.TOKEN_KEY"
var jsonParser = bodyParser.json();
// creates a jsonparse to pass incoming body request in json
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
// Middleware to parse URL-encoded bodies
);
app.use(bodyParser.json()); //middleware to pass the json bodies

app.use(function (req, res, next) {
  //it is a custom middleware function that sets various https headers to control how request and responses are handled 
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Content-Type, Authorization,Authentication,withCredentials, Content-Length, X-Requested-With, Accept, x-access-token,credentials, Origin, X-Content-Type-Options"
  );
  res.header(
    "Access-Control-Expose-Headers",
    "x-access-token, Authorization, Authentication, withCredentials, credentials, Set-Cookie"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// App Routes
app.use("/auth", require("./routes/authHandling"));
app.use("/admin", require("./routes/adminHandling"));

var server = app.listen(PORT, () => {
  console.info(`Server is running on port ${PORT}`);
});