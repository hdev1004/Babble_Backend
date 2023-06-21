
const express = require("express");
const helmet = require("helmet");
require('dotenv').config();
const port = process.env.WEB_PORT;
const testConnection = require("./testConnection");

const app = express();

app.use(helmet());
app.use('/images', express.static('images'))
app.disable('x-powered-by');

app.get("/", (req, res) => {
    res.send(`
        <div>
            <p>솜사탕씻은너구리</p>
            <img width="400px" src="images/title.png"></img>
        </div>
    `)  
})

app.get('/users', testConnection.getAllUsers);


// 3000 포트로 서버 오픈
app.listen(port, function() {
    console.log("start! express server on port " + port)
})
