//최상위
require("dotenv").config();

const express = require("express"); //서버 사용
const helmet = require("helmet"); //보호용
const fs = require("fs");
const cors = require("cors"); //api 요청하다보면 cors 에러가 생기는데 알아서 처리하는 애
const swagger_options = require("./swagger");
//const hash = md5("sisiblog");

const UserRoutes = require("./ROUTES/USER/index"); //routes 폴더에서 이거 불러오셈~ 여기만 보면 되는 거고
const LoginRoutes = require("./ROUTES/LOGIN/index"); //여기 아래로만 추가하면 끝
const FriendRoutes = require("./ROUTES/FRIEND/index");
const BoardRoutes = require("./ROUTES/BOARD/index");
const RegisterRoutes = require("./ROUTES/REGISTER/index");

// Swagger
const swaggerJSDoc = require("swagger-jsdoc"); //얌 파일
const swaggerUi = require("swagger-ui-express");
const promMid = require("express-prometheus-middleware");

const port = process.env.WEB_PORT; //env 파일 안에 포트번호 불러옴
const app = express();

//SSL 미적용
const options = {
  key: fs.readFileSync("./key/rootca.key"),
  cert: fs.readFileSync("./key/rootca.crt"),
};

const specs = swaggerJSDoc(swagger_options.options); //스웨거 관련

app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));
//API 문서
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(
  promMid({
    //시각화를 위한 자료 수집
    metricsPath: "/metrics", //매트릭 : http request 서버에 대한 값을 보여줌.
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
  })
);

app.use(helmet());

//Routes
app.use("/user", UserRoutes); //위에 하나 하면 여기에도 하나 해야함
app.use("/login", LoginRoutes);
app.use("/friend", FriendRoutes);
app.use("/board", BoardRoutes);
app.use("/register", RegisterRoutes);

app.disable("x-powered-by");

app.get("/", async (req, res) => {
  res.send(`
        <div>
            <p>솜사탕씻은너구리</p>
            <img width="400px" src="images/title.png"></img>
        </div>
    `);
});

//5000 포트로 서버 오픈
app.listen(port, function () {
  console.log("start! express server on port " + port);
});
