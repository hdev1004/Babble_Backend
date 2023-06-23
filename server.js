//최상위
require('dotenv').config();

const express = require("express");
const helmet = require("helmet");
const fs = require('fs');
const cors = require("cors");
//const hash = md5("sisiblog");

//📕 GET
const RegisterGET = require("./GET/REGISTER/register");

//📕 POST
const LoginPOST = require("./POST/USER/login");
const RegisterPOST = require("./POST/USER/register");

const port = process.env.WEB_PORT;
const app = express();


const options = {
    key: fs.readFileSync('./key/rootca.key'),
    cert: fs.readFileSync('./key/rootca.crt')
};

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use('/images', express.static('images'));

app.disable('x-powered-by');

//let data = jwt.tokenGenerator("hello", "test");
//console.log("TOKEN : ", data);


app.get("/", async (req, res) => {
    res.send(`
        <div>
            <p>솜사탕씻은너구리</p>
            <img width="400px" src="images/title.png"></img>
        </div>
    `)  
})


//📕 GET
//└─📜 Register
app.get("/register/:id", RegisterGET.isIdDuplicate);


//📕 POST
//└─📜 User
app.post("/user", LoginPOST.loginCheck);
//└─📜 Register
app.post("/register", RegisterPOST.register);

//GET


//5000 포트로 서버 오픈
app.listen(port, function() {
    console.log("start! express server on port " + port)
})

