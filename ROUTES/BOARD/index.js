const express = require("express");
const boardController = require("./controller");

const router = express.Router();

//글 종류
router.get("/kind", boardController.getBoardKindList);

//글 종류 : id
router.get("/kind/:id", boardController.getBoardKindList);

//페이지 불러오기 page: 현재 페이지, unit : 몇 개씩(ex - 10, 20, 30)
router.get("/list/:page/:unit", boardController.getBoardList);
router.get("/:board_token", boardController.getBoardContents);

router.post("/add", boardController.posting);

router.get("/comment/:board_token", boardController.getCommentList);
router.post("/comment/add", boardController.addComment);

//좋아요
router.post("/add/like", boardController.addBoardLike);

//좋아요 취소
router.post("/cancel/like", boardController.cancelBoardLike);

//좋아요 검색
router.post("/check/like", boardController.boardLikeCheck);

//닉네임 변경
router.post("/changeNickname", boardController.changeNickname);

module.exports = router;
