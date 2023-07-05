const { getConnectionPromise } = require("../../db");

const friendAdd = async(req, res) => {
    let body = req.body;
    console.log("REQ : ", body);

    try {
        (await getConnectionPromise).beginTransaction();
        (await getConnectionPromise).query(`INSERT INTO FRIEND_LIST(token, friend_token) VALUES ("${body.token}", "${body.friend_token}")`);
        (await getConnectionPromise).query(`INSERT INTO FRIEND_LIST(token, friend_token) VALUES ("${body.friend_token}", "${body.token}")`);
        (await getConnectionPromise).query(`DELETE FROM FRIEND_REQ WHERE friend_token = "${body.token}" and token = "${body.friend_token}"`);
        (await getConnectionPromise).commit();
    } catch(err) {
        console.log("Err");
        (await getConnectionPromise).rollback();
        throw err;
    } finally {
        (await getConnectionPromise).release();
    }
    return res.send({
        message: "200 OK"
    })
}

const friendRequest = async(req, res) => {
    let body = req.body;
    console.log("REQ : ", body);

    try {
        (await getConnectionPromise).beginTransaction();
        (await getConnectionPromise).query(`INSERT INTO FRIEND_REQ(token, friend_token) VALUES ("${body.token}", "${body.friend_token}")`);
        (await getConnectionPromise).commit();
    } catch(err) {
        (await getConnectionPromise).rollback();
        throw err;
    } finally {
        (await getConnectionPromise).release();
    }

    return res.send({
        message: "200 OK"
    })

}

module.exports = {
    friendAdd,
    friendRequest
}