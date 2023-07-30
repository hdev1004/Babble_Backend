const express = require("express");
const loginController = require('./controller');

const router = express.Router();

//Get Salt
router.get("/salt/:id", loginController.getSalt);

//토큰 인증
router.get("/jwt/token/:token", loginController.verifyToken);;

//로그인 체크
router.post("/", loginController.loginCheck);

//토큰 생성
router.post("/jwt/token", loginController.tokenGenerator);

module.exports = router;