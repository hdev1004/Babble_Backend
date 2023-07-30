const model = require("./model");

//친구 목록
const getFriendList = async (req, res) => {
    let param = req.params;
    console.log(param);
 
    let data = await model.getFriendList(param);
    if(!data.isError) {
        return res.send({
            message: "200 OK",
            data: data.data
        })
    }
    else {
        return res.status(500).send({
            message: "500 FriendList Error"
        })
    }
}

//친구 요청 목록
const getFriendRequest = async(req, res) => {
    let param = req.params;
    let data = await model.getFriendRequest(param);

    if(!data.isError) {
        return res.send({
            message: "200 OK",
            data: data.data
        })
    }
    else {
        return res.status(500).send({
            message: "500 FriendRequest Error"
        })
    }
}

const getFriendRequestSendList = async(req, res) => {
    let param = req.params;
    let data = await model.getFriendRequestSendList(param);
    
    if(!data.isError) {
        return res.send({
            message: "200 OK",
            data: data.data
        })
    }
    else {
        return res.status(500).send({
            message: "500 FriendRequest Error"
        })
    }
}

const friendAdd = async(req, res) => {
    let body = req.body;
    let data = await model.friendAdd(body);
    
    if(!data.isError) {
        return res.send({
            message: "200 OK",
            data: data.data
        })
    }
    else {
        return res.status(500).send({
            message: "500 FriendRequest Error"
        })
    }
}

const friendRequest = async(req, res) => {
    let body = req.body;
    let data = await model.friendRequest(body);
    
    if(!data.isError) {
        return res.send({
            message: "200 OK",
            data: data.data
        })
    }
    else {
        return res.status(500).send({
            message: "500 FriendRequest Error"
        })
    }
}

//친구 끊기
const unFriend = async(req, res) => {
    let body = req.body;
    let data = await model.unFriend(body);
    
    if(!data.isError) {
        return res.send({
            message: "200 OK",
            data: data.data
        })
    }
    else {
        return res.status(500).send({
            message: "500 FriendRequest Error"
        })
    }
}

//친구 요청 취소
const cancleFriend = async(req, res) => {
    let body = req.body;
    let data = await model.cancleFriend(body);
    
    if(!data.isError) {
        return res.send({
            message: "200 OK",
            data: data.data
        })
    }
    else {
        return res.status(500).send({
            message: "500 FriendRequest Error"
        })
    }
}

//친구 추가 거부
const refuseFrined = async(req, res) => {
    let body = req.body;
    let data = await model.refuseFrined(body);
    
    if(!data.isError) {
        return res.send({
            message: "200 OK",
            data: data.data
        })
    }
    else {
        return res.status(500).send({
            message: "500 FriendRequest Error"
        })
    }
}


module.exports = {
    getFriendList,
    getFriendRequest,
    getFriendRequestSendList,
    friendAdd,
    friendRequest,
    unFriend,
    cancleFriend,
    refuseFrined
}