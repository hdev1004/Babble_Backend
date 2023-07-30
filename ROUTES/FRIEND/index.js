const express = require("express");
const friendController = require('./controller');

const router = express.Router();

//Get Salt
router.get("/list/:token", friendController.getFriendList);

//친구 요청 리스트
router.get("/request/:token", friendController.getFriendRequest);

//친구 요청 보낸 리스트
router.get("/request/send/:token", friendController.getFriendRequestSendList);


//친구 추가
router.post("/add", friendController.friendAdd);

//친구 요청
router.post("/request", friendController.friendRequest);

//친구 취소
router.delete("/request", friendController.cancleFriend);

//친구 추가 거부
router.delete("/refuse", friendController.refuseFrined);

//친구 끊기
router.delete("/", friendController.unFriend);

module.exports = router;