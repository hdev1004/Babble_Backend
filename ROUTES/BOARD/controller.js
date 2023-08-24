const model = require("./model");

const getBoardKindList = async (req, res) => {
  let param = req.params;
  console.log(param);

  let data = await model.getBoardKindList(param);
  if (!data.isError) {
    return res.send({
      message: "200 OK",
      data: data.data,
    });
  } else {
    return res.status(500).send({
      message: "500 getBoardKindList Error",
    });
  }
};

const getBoardList = async (req, res) => {
  let param = req.params;
  console.log(param);

  let data = await model.getBoardList(param);
  if (!data.isError) {
    return res.send({
      message: "200 OK",
      data: data.data,
    });
  } else {
    return res.status(500).send({
      message: "500 getBoardList Error",
    });
  }
};

const getBoardContents = async (req, res) => {
  let param = req.params;
  console.log(param);

  let data = await model.getBoardContents(param);
  if (!data.isError) {
    return res.send({
      message: "200 OK",
      data: data.data,
    });
  } else {
    return res.status(500).send({
      message: "500 getBoardContents Error",
    });
  }
};

//포스팅
const posting = async (req, res) => {
  let body = req.body;
  console.log(body);

  let data = await model.posting(body);
  if (!data.isError) {
    return res.send({
      message: "200 OK",
      data: data.data,
    });
  } else {
    return res.status(500).send({
      message: "500 Posting Error",
    });
  }
};

const addComment = async (req, res) => {
  let body = req.body;
  console.log(body);

  let data = await model.addComment(body);
  if (!data.isError) {
    return res.send({
      message: "200 OK",
      data: data.data,
    });
  } else {
    return res.status(500).send({
      message: "500 AddComment Error",
    });
  }
};

const getCommentList = async (req, res) => {
  let param = req.params;

  let data = await model.getCommentList(param);
  if (!data.isError) {
    return res.send({
      message: "200 OK",
      data: data.data,
    });
  } else {
    return res.status(500).send({
      message: "500 Posting Error",
    });
  }
};

const addBoardLike = async (req, res) => {
  let body = req.body;

  let data = await model.addBoardLike(body);
  if (!data.isError) {
    return res.send({
      message: "200 OK",
      data: data.data,
    });
  } else {
    return res.status(500).send({
      message: "500 Posting Error",
    });
  }
};

const cancelBoardLike = async (req, res) => {
  let body = req.body;
  console.log(body);

  let data = await model.cancelBoardLike(body);
  if (!data.isError) {
    return res.send({
      message: "200 OK",
      data: data.data,
    });
  } else {
    return res.status(500).send({
      message: "500 Posting Error",
    });
  }
};

const boardLikeCheck = async (req, res) => {
  let body = req.body;
  console.log(body);

  let data = await model.boardLikeCheck(body);
  if (!data.isError) {
    return res.send({
      message: "200 OK",
      data: data.data,
    });
  } else {
    return res.status(500).send({
      message: "500 Posting Error",
    });
  }
};

const changeNickname = async (req, res) => {
  let body = req.body;
  console.log(body);

  let data = await model.changeNickname(body);

  if (!data.isError) {
    return res.send({
      message: "200 OK",
      data: data.data,
    });
  } else {
    return res.status(500).send({
      message: "500 changeKickname Error",
    });
  }
};

module.exports = {
  changeNickname,
  boardLikeCheck,
  addBoardLike,
  cancelBoardLike,
  getBoardList,
  getBoardKindList,
  getBoardContents,
  posting,
  addComment,
  getCommentList,
};
