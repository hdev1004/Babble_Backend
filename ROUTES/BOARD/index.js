const express = require("express");
const boardController = require('./controller');

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

module.exports = router;