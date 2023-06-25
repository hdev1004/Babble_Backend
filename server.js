//최상위
require('dotenv').config();

const express = require("express");
const helmet = require("helmet");
const fs = require('fs');
const cors = require("cors");
//const hash = md5("sisiblog");

//📕 GET
const UserGET = require("./GET/USER/login");
const RegisterGET = require("./GET/REGISTER/register");

//📕 POST
const UserPOST = require("./POST/USER/login");
const RegisterPOST = require("./POST/REGISTER/register");

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
//└─📜 User
app.get("/login/salt/:id", UserGET.getSalt);
app.get("/login/jwt/token/:token", UserGET.verifyToken);

//└─📜 Register
app.get("/register/id/:id", RegisterGET.isIdDuplicate);
app.get("/register/nickname/:nickname", RegisterGET.isNicknameDuplicate);


//📕 POST
//└─📜 User
app.post("/login", UserPOST.loginCheck);
app.post("/login/jwt/token", UserPOST.tokenGenerator);
//└─📜 Register
app.post("/register", RegisterPOST.register);

//GET


//5000 포트로 서버 오픈
app.listen(port, function() {
    console.log("start! express server on port " + port)
})

