
const express = require("express");
const helmet = require("helmet");
const port = process.env.WEB_PORT;
require('dotenv').config();
const testConnection = require("./testConnection");

// express 는 함수이므로, 반환값을 변수에 저장한다.
const app = express();

// 보안설정
app.use(helmet());
app.disable('x-powered-by');

app.get("/", (req, res) => {
    res.send(`<p>솜사탕씻은너구리</p>`)  
})

app.get('/users', testConnection.getAllUsers);


// 3000 포트로 서버 오픈
app.listen(port, function() {
    console.log("start! express server on port " + port)
})
