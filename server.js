//최상위
require('dotenv').config();

const express = require("express");
const helmet = require("helmet");
const http = require('http');
const https = require('https');
const fs = require('fs');

const encryption = require("./FUNCTION/encryption");
const jwt = require("./FUNCTION/jwt");

const UserGet = require("./POST/USER/user");


const port = process.env.WEB_PORT;
const app = express();

const options = {
    key: fs.readFileSync('./key/rootca.key'),
    cert: fs.readFileSync('./key/rootca.crt')
};

app.use(express.json());
app.use(helmet());
app.use('/images', express.static('images'));

app.disable('x-powered-by');

//let data = jwt.tokenGenerator("hello", "test");
//console.log("TOKEN : ", data);
let result = jwt.tokenGenerator({
    id: "11",
    pw: "22"
}, 1);
console.log("RESULT : ", result);

result = jwt.tokenGenerator({
    id: "11",
    pw: "22"
}, 2);
console.log("RESULT : ", result);

app.get("/", async (req, res) => {
    console.log(result);

    res.send(`
        <div>
            <p>솜사탕씻은너구리</p>
            <img width="400px" src="images/title.png"></img>
        </div>
    `)  
})


//📕 POST
//└─📜 USER
app.post("/user", UserGet.getUser);
//GET


//5000 포트로 서버 오픈
app.listen(port, function() {
    console.log("start! express server on port " + port)
})

