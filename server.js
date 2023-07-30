//최상위
require('dotenv').config();


const express = require("express");
const helmet = require("helmet");
const fs = require('fs');
const cors = require("cors");
const swagger_options = require("./swagger");
//const hash = md5("sisiblog");

const UserRoutes = require("./ROUTES/USER/index");
const LoginRoutes = require("./ROUTES/LOGIN/index");
const FriendRoutes = require("./ROUTES/FRIEND/index");
const BoardRoutes = require("./ROUTES/BOARD/index");
const RegisterRoutes = require("./ROUTES/REGISTER/index");

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

//Routes
app.use("/user", UserRoutes);
app.use("/login", LoginRoutes);
app.use("/friend", FriendRoutes);
app.use("/board", BoardRoutes);
app.use("/register", RegisterRoutes);


app.disable('x-powered-by');

app.get("/", async (req, res) => {
    res.send(`
        <div>
            <p>솜사탕씻은너구리</p>
            <img width="400px" src="images/title.png"></img>
        </div>
    `)  
})


//5000 포트로 서버 오픈
app.listen(port, function() {
    console.log("start! express server on port " + port)
})

