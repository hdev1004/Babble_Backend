//최상위
require('dotenv').config();

const express = require("express");
const helmet = require("helmet");
const fs = require('fs');
const cors = require("cors");
const swagger_options = require("./swagger");
//const hash = md5("sisiblog");

//📕 GET
const LoginGET = require("./GET/LOGIN/login");
const RegisterGET = require("./GET/REGISTER/register");
const FrinedGET = require("./GET/FRIEND/friend");
const UserGET = require("./GET/USER/user");
const BoardGET = require("./GET/BOARD/board");

//📕 POST
const LoginPOST = require("./POST/LOGIN/login");
const RegisterPOST = require("./POST/REGISTER/register");
const FrinedPOST = require("./POST/FRIEND/friend");
const BoardPOST = require("./POST/BOARD/board");

//📕 DELETE
const FriendDEL = require("./DELETE/FRIEND/friend");

// Swagger 
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
app.get("/user/list/:nickname", UserGET.getUserList);
app.get("/user/list/:nickname/:token", UserGET.getUserList);

//└─📜 Login
app.get("/login/salt/:id", LoginGET.getSalt);
app.get("/login/jwt/token/:token", LoginGET.verifyToken);

//└─📜 Friend
app.get("/friend/list/:token", FrinedGET.getFriendList);
app.get("/friend/request/:token", FrinedGET.getFriendRequest);
app.get("/friend/request/send/:token", FrinedGET.getFriendRequestSendList);

//└─📜 Register
app.get("/register/id/:id", RegisterGET.isIdDuplicate);
app.get("/register/nickname/:nickname", RegisterGET.isNicknameDuplicate);

//└─📜 Board
app.get("/board/kind", BoardGET.getBoardKindList);
app.get("/board/kind/:id", BoardGET.getBoardKindList);
app.get("/board/list/:page/:unit", BoardGET.getBoardList);
app.get("/board/:board_token", BoardGET.getBoardContents);

//📕 POST
//└─📜 Login
app.post("/login", LoginPOST.loginCheck);
app.post("/login/jwt/token", LoginPOST.tokenGenerator);
//└─📜 Register
app.post("/register", RegisterPOST.register);
//└─📜 Friend
app.post("/friend/add", FrinedPOST.friendAdd);
app.post("/friend/request", FrinedPOST.friendRequest);
//└─📜 Board
app.post("/board/add", BoardPOST.posting);



//📕 DELETE
//└─📜 Friend
app.delete("/friend/request", FriendDEL.cancleFriend);
app.delete("/friend/refuse", FriendDEL.refuseFrined);
app.delete("/friend", FriendDEL.unFriend);

//5000 포트로 서버 오픈
app.listen(port, function() {
    console.log("start! express server on port " + port)
})

