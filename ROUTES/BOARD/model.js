const { poolPromise } = require("../../db");

const getBoardKindList = async (param) => {
  isError = false;
  let rows = null;
  let conn = await poolPromise.getConnection(async (con) => con);
  let query = null;
  if (param.id === undefined) {
    query = `SELECT * FROM BOARD_KINDS ORDER BY sequence ASC`;
  } else {
    query = `SELECT * FROM BOARD_KINDS WHERE board_kind="${param.id}"`;
  }

  try {
    await conn.beginTransaction();
    [rows] = await conn.query(query);
    await conn.commit();
  } catch (err) {
    console.log(err);
    await conn.rollback();
    isError = true;
  } finally {
    conn.release();
  }

  return {
    isError: isError,
    data: rows,
  };
};

const getBoardList = async (param) => {
  let isError = false;
  let unit = parseInt(param.unit);
  let page = parseInt(param.page);

  let conn = await poolPromise.getConnection(async (con) => con);
  let rows = null;

  try {
    await conn.beginTransaction();
    [rows] = await conn.query(`SELECT *, L.nickname,
            IFNULL((SELECT count(*) FROM BOARD_LIKES BL WHERE B.board_token = BL.board_token GROUP BY board_token), 0) AS likes 
            FROM BOARD_LIST as B 
            LEFT JOIN (SELECT nickname, token FROM LOGIN) as L ON B.token = L.token 
            LEFT JOIN (SELECT board_kind, name FROM BOARD_KINDS) as BK ON B.board_kind = BK.board_kind
            ORDER BY B.upload_date DESC LIMIT ${(page - 1) * unit}, ${
      page * unit
    }`);
    await conn.commit();
  } catch (err) {
    console.log(err);
    await conn.rollback();
    isError = true;
  } finally {
    conn.release();
  }

  return {
    data: rows,
    isError: isError,
  };
};

const getBoardContents = async (param) => {
  let board_token = param.board_token;
  let isError = false;

  let conn = await poolPromise.getConnection(async (con) => con);
  let rows = null;

  try {
    await conn.beginTransaction();
    [rows] = await conn.query(`SELECT * FROM BOARD_LIST as BL 
        LEFT JOIN (SELECT board_token, post FROM BOARD) as B ON BL.board_token = B.board_token
        LEFT JOIN (SELECT board_kind, name FROM BOARD_KINDS) as BK ON BL.board_kind = BK.board_kind
        LEFT JOIN (SELECT token, nickname FROM LOGIN) as L ON BL.token = L.token WHERE BL.board_token="${board_token}"`);
    await conn.commit();
  } catch (err) {
    console.log(err);
    await conn.rollback();
    isError = true;
  } finally {
    conn.release();
  }

  return {
    isError: isError,
    data: rows,
  };
};

const addComment = async (body) => {
  let board_token = body.board_token;
  let target_token = body.target_token;
  let comment_token = body.comment_token;
  let writer_token = body.writer_token;
  let comment = body.comment;

  let isError = false;

  let conn = await poolPromise.getConnection(async (con) => con);
  let rows = null;

  try {
    await conn.beginTransaction();
    if (target_token === undefined) {
      //일반 댓글
      await conn.query(
        `INSERT INTO COMMENTS(board_token, writer_token, comment_token, comment) VALUES ("${board_token}", "${writer_token}", "${comment_token}", "${comment}")`
      );
    } else {
      //대댓글
      await conn.query(
        `INSERT INTO REPLY_COMMENTS(comment_token, writer_token, target_token, comment) VALUES ("${comment_token}", "${writer_token}", "${target_token}","${comment}")`
      );
    }

    await conn.commit();
  } catch (err) {
    console.log(err);
    await conn.rollback();
    isError = true;
  } finally {
    conn.release();
  }

  return {
    isError: isError,
    data: rows,
  };
};

const getCommentList = async (param) => {
  let board_token = param.board_token;
  let isError = false;
  let conn = await poolPromise.getConnection(async (con) => con);
  let rows = null;

  try {
    await conn.beginTransaction();
    [rows] = await conn.query(`
            SELECT C.*, 
            RC.target_token, RC.writer_token AS reply_writer_token, RC.comment_token AS reply_comment_token, RC.comment AS reply_comment, RC.upload_date AS reply_upload_date,
            (SELECT nickname FROM LOGIN WHERE token = C.writer_token) AS nickname,
            (SELECT nickname FROM LOGIN WHERE token = RC.writer_token) AS reply_writer_nickname
            FROM COMMENTS C 
            LEFT JOIN REPLY_COMMENTS RC ON C.comment_token = RC.target_token
            WHERE C.board_token = "${board_token}"
            ORDER BY C.upload_date ASC, RC.upload_date ASC;
        `);

    await conn.commit();
  } catch (err) {
    console.log(err);
    await conn.rollback();
    isError = true;
  } finally {
    conn.release();
  }

  return {
    isError: isError,
    data: rows,
  };
};

const posting = async (body) => {
  let isError = false;
  let conn = await poolPromise.getConnection(async (con) => con);
  console.log("REQ : ", body);

  const board_token = body.board_token;
  const token = body.token;
  const title = body.title;
  const category = body.category;
  const content = body.content;

  try {
    await conn.beginTransaction();
    let [res] = await conn.query(
      `SELECT * FROM BOARD_KINDS WHERE name="${category}"`
    );
    await conn.query(
      `INSERT INTO BOARD_LIST(board_token, board_kind, token, title) VALUES ("${board_token}", "${res[0].board_kind}", "${token}", "${title}")`
    );
    await conn.query(
      `INSERT INTO BOARD(board_token, token, post) VALUES ("${board_token}", "${token}", "${content}")`
    );
    await conn.commit();
  } catch (err) {
    console.log("Err");
    await conn.rollback();
    isError = false;
  } finally {
    conn.release();
  }

  return {
    isError: isError,
  };
};

const addBoardLike = async (body) => {
  const board_token = body.board_token;
  const user_token = body.user_token;
  let isError = false;
  let conn = await poolPromise.getConnection(async (con) => con);

  try {
    await conn.beginTransaction();
    await conn.query(
      `INSERT INTO BOARD_LIKES(board_token, user_token) VALUES("${board_token}", "${user_token}")`
    );

    await conn.commit();
  } catch (err) {
    console.log(err);
    await conn.rollback();
    isError = true;
  } finally {
    conn.release();
  }

  return {
    isError: isError,
  };
};

const cancelBoardLike = async (body) => {
  const board_token = body.board_token;
  const user_token = body.user_token;
  let isError = false;
  let conn = await poolPromise.getConnection(async (con) => con);

  try {
    await conn.beginTransaction();
    await conn.query(
      `DELETE FROM BOARD_LIKES WHERE board_token="${board_token}" and user_token="${user_token}"`
    );
    await conn.commit();
  } catch (err) {
    console.log(err);
    await conn.rollback();
    isError = true;
  } finally {
    conn.release();
  }

  return {
    isError: isError,
  };
};

const boardLikeCheck = async (body) => {
  const board_token = body.board_token;
  const user_token = body.user_token;
  let isError = false;
  let conn = await poolPromise.getConnection(async (con) => con);
  let data = {};

  try {
    await conn.beginTransaction();
    let [isLike] = await conn.query(
      `SELECT * FROM BOARD_LIKES WHERE board_token="${board_token}" and user_token="${user_token}"`
    );
    let [count] = await conn.query(
      `SELECT COUNT(*) AS board_count FROM BOARD_LIKES WHERE board_token="${board_token}" GROUP BY board_token`
    );

    data = {
      isLike: isLike.length === 1 ? true : false,
      board_count: count.length === 0 ? 0 : count[0].board_count,
    };
    await conn.commit();
  } catch (err) {
    console.log(err);
    await conn.rollback();
    isError = true;
  } finally {
    conn.release();
  }

  return {
    isError: isError,
    data: data,
  };
};

const changeNickname = async (body) => {
  let isError = false;
  let conn = await poolPromise.getConnection(async (con) => con); //DB연결
  let data = {};

  const nickname = body.nickname;
  const user_token = body.user_token;

  try {
    await conn.beginTransaction();
    let [chNick] = await conn.query(
      `SELECT nickname FROM LOGIN WHERE nickname= "${nickname}"`
    );
    await conn.query(
      `UPDATE LOGIN SET nickname = "${nickname}" WHERE token = "${user_token}"`
    );

    data = chNick;

    await conn.commit();
  } catch (err) {
    console.log(err);
    await conn.rollback();
    isError = true;
  } finally {
    conn.release(); //반환, 재사용 하려고
  }

  return {
    isError: isError,
    data: data,
  };
};

const myPost = async (body) => {
  let isError = false;
  let conn = await poolPromise.getConnection(async (con) => con); //DB연결
  let data = {};

  const user_token = body.user_token;

  try {
    await conn.beginTransaction();
    let [myPost] = await conn.query(
      `SELECT * FROM BOARD_LIST WHERE token = "${user_token}"`
    );

    data = myPost;

    await conn.commit();
  } catch (err) {
    console.log(err);
    await conn.rollback();
    isError = true;
  } finally {
    conn.release(); //반환, 재사용 하려고
  }

  return {
    isError: isError,
    data: data,
  };
};

const myComments = async (body) => {
  let isError = false;
  let conn = await poolPromise.getConnection(async (con) => con); //DB연결
  let data = {};

  const user_token = body.user_token;

  try {
    await conn.beginTransaction();
    let [myComments] = await conn.query(
      `SELECT C.*, 
      RC.target_token, RC.writer_token AS reply_writer_token, RC.comment_token AS reply_comment_token, RC.comment AS reply_comment, RC.upload_date AS reply_upload_date,
      (SELECT nickname FROM LOGIN WHERE token = C.writer_token) AS nickname,
      (SELECT nickname FROM LOGIN WHERE token = RC.writer_token) AS reply_writer_nickname
      FROM COMMENTS C 
      LEFT JOIN REPLY_COMMENTS RC ON C.comment_token = RC.target_token
      WHERE C.writer_token = "${user_token}"
      ORDER BY C.upload_date ASC, RC.upload_date ASC`
    );

    data = myComments;

    await conn.commit();
  } catch (err) {
    console.log(err);
    await conn.rollback();
    isError = true;
  } finally {
    conn.release(); //반환, 재사용 하려고
  }

  return {
    isError: isError,
    data: data,
  };
};


const boardSearch = async (param) => {
  let isError = false;
  let conn = await poolPromise.getConnection(async (con) => con); //DB연결
  let data = {};

  const search = param.search;

  // 

  try {
    await conn.beginTransaction();
    let [temp] = await conn.query(
      `select *
      from BOARD_LIST
      WHERE title LIKE '%${search}%'`
    );

    data = temp;

    await conn.commit();
  } catch (err) {
    console.log(err);
    await conn.rollback();
    isError = true;
  } finally {
    conn.release(); //반환, 재사용 하려고
  }

  return {
    isError: isError,
    data: data,
  };
};

module.exports = {
  myComments,
  myPost,
  changeNickname,
  boardLikeCheck,
  addBoardLike,
  cancelBoardLike,
  getBoardKindList,
  getBoardList,
  getBoardContents,
  posting,
  addComment,
  getCommentList,
  boardSearch
};
