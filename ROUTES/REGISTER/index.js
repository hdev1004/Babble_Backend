const express = require("express");
const registerController = require('./controller');

const router = express.Router();

router.get("/id/:id", registerController.isIdDuplicate);
router.get("/nickname/:nickname", registerController.isNicknameDuplicate);
router.post("/", registerController.register);

module.exports = router;