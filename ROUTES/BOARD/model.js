const { poolPromise } = require("../../db");

const getBoardKindList = async (param) => {
    isError = false;
    let rows = null;
    let conn = await poolPromise.getConnection(async con => con);
    let query = null;
    if(param.id === undefined) {
        query = `SELECT * FROM BOARD_KINDS ORDER BY sequence ASC`;
    } else {
        query = `SELECT * FROM BOARD_KINDS WHERE board_kind="${param.id}"`;
    }

    try {
        await conn.beginTransaction();
        [rows] = await conn.query(query);
        await conn.commit();
    } catch(err) {
        console.log(err);
        await conn.rollback();
        isError = true;
    } finally {
        conn.release();
    }


    return {
        isError: isError,
        data: rows
    };
}

const getBoardList = async(param) => {
    let isError = false;
    let unit = parseInt(param.unit);
    let page = parseInt(param.page);

    let conn = await poolPromise.getConnection(async con => con);
    let rows = null;

    try {
        await conn.beginTransaction();
        [rows] = await conn.query(`SELECT *, L.nickname  FROM BOARD_LIST as B 
            LEFT JOIN (SELECT nickname, token FROM LOGIN) as L ON B.token = L.token 
            LEFT JOIN (SELECT board_kind, name FROM BOARD_KINDS) as BK ON B.board_kind = BK.board_kind
            ORDER BY B.upload_date DESC LIMIT ${(page - 1) * unit}, ${page * unit}`);
        await conn.commit();
    } catch(err) {
        console.log(err);
        await conn.rollback();
        isError = true;
    } finally {
        conn.release();
    }

    return {
        data: rows,
        isError: isError
    }
}

const getBoardContents = async(param) => {
    let board_token = param.board_token;
    let isError = false;

    let conn = await poolPromise.getConnection(async con => con);
    let rows = null;

    try {
        await conn.beginTransaction();
        [rows] = await conn.query(`SELECT * FROM BOARD_LIST as BL 
        LEFT JOIN (SELECT board_token, post FROM BOARD) as B ON BL.board_token = B.board_token
        LEFT JOIN (SELECT board_kind, name FROM BOARD_KINDS) as BK ON BL.board_kind = BK.board_kind
        LEFT JOIN (SELECT token, nickname FROM LOGIN) as L ON BL.token = L.token WHERE BL.board_token="${board_token}"`);
        await conn.commit();
    } catch(err) {
        console.log(err);
        await conn.rollback();
        isError = true;
    } finally {
        conn.release();
    }

    return {
        isError: isError,
        data: rows
    }
}

const addComment = async(body) => {
    let board_token = body.board_token;
    let target_token = body.target_token;
    let comment_token = body.comment_token;
    let writer_token = body.writer_token;
    let status = body.status;
    let comment = body.comment;

    let isError = false;

    let conn = await poolPromise.getConnection(async con => con);
    let rows = null;

    
    try {
        await conn.beginTransaction();
        await conn.query(`INSERT INTO COMMENTS_TOKEN(board_token, target_token, comment_token, writer_token, status) VALUES 
        ("${board_token}", "${target_token}", "${comment_token}", "${writer_token}", ${status})`);
        await conn.query(`INSERT INTO COMMENTS(comment_token, comment) VALUES ("${comment_token}", "${comment}")`);
        
        await conn.commit();
    } catch(err) {
        console.log(err);
        await conn.rollback();
        isError = true;
    } finally {
        conn.release();
    }

    return {
        isError: isError,
        data: rows
    }

}

const getCommentList = async(param) => {
    let board_token = param.board_token;
    let isError = false;
    let conn = await poolPromise.getConnection(async con => con);
    let rows = null;
    
    try {
        await conn.beginTransaction();
        [rows] = await conn.query(`SELECT * FROM COMMENTS_TOKEN AS CT
        LEFT JOIN (SELECT comment_token, comment FROM COMMENTS) AS C ON CT.comment_token = C.comment_token
        LEFT JOIN (SELECT token, nickname FROM LOGIN) AS L ON CT.writer_token = L.token 
        WHERE CT.board_token = "${board_token}" ORDER BY upload_date ASC`);
       
        await conn.commit();
    } catch(err) {
        console.log(err);
        await conn.rollback();
        isError = true;
    } finally {
        conn.release();
    }

    return {
        isError: isError,
        data: rows
    }

}



const posting =  async(body) => {
    let isError = false;
    let conn = await poolPromise.getConnection(async con => con);
    console.log("REQ : ", body);

    const board_token = body.board_token;
    const token = body.token;
    const title = body.title;
    const category = body.category;
    const content = body.content;

    try {
        await conn.beginTransaction();
        let [res] = await conn.query(`SELECT * FROM BOARD_KINDS WHERE name="${category}"`);
        await conn.query(`INSERT INTO BOARD_LIST(board_token, board_kind, token, title, likes) VALUES ("${board_token}", "${res[0].board_kind}", "${token}", "${title}", 0)`);
        await conn.query(`INSERT INTO BOARD(board_token, token, post) VALUES ("${board_token}", "${token}", "${content}")`);
        await conn.commit();
    } catch(err) {
        console.log("Err");
        await conn.rollback();
        isError = false;
    } finally {
        conn.release();
    }

    return {
        isError: isError
    }
}



module.exports = {
    getBoardKindList,
    getBoardList,
    getBoardContents,
    posting,
    addComment,
    getCommentList
}