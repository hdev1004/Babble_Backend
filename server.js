//최상위
require('dotenv').config();

const express = require("express");
const helmet = require("helmet");
const fs = require('fs');
const cors = require("cors");
const swagger_options = require("./swagger");
//const hash = md5("sisiblog");

//📕 GET
const UserGET = require("./GET/USER/login");
const RegisterGET = require("./GET/REGISTER/register");

//📕 POST
const UserPOST = require("./POST/USER/login");
const RegisterPOST = require("./POST/REGISTER/register");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const promMid = require('express-prometheus-middleware');

const port = process.env.WEB_PORT;
const app = express();

//SSL 미적용
const options = {
    key: fs.readFileSync('./key/rootca.key'),
    cert: fs.readFileSync('./key/rootca.crt')
};

const specs = swaggerJSDoc(swagger_options.options);

app.use(cors());
app.use(express.json());
app.use('/images', express.static('images'));
//API 문서
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(promMid({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
  }));


app.use(helmet());


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

