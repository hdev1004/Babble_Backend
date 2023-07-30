const express = require("express");
const userController = require('./controller');

const router = express.Router();

//사용자 조회
router.get("/list/:nickname", userController.getUserList);

//사용자 조회 - 토큰
router.get("/list/:nickname/:token", userController.getUserList);

module.exports = router;