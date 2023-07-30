
const model = require("./model");

const isNicknameDuplicate = async(req, res) => {
    let param = req.params;
    let data = await model.isNicknameDuplicate(param);
    if(!data.isError) {
        return res.send({
            message: "200 OK",
            data: data.data
        })
    }
    else {
        return res.status(500).send({
            message: "500 UserList Error"
        })
    }
}


const isIdDuplicate = async(req, res) => {
    let param = req.params;
    let data = await model.isIdDuplicate(param);
    if(!data.isError) {
        return res.send({
            message: "200 OK",
            data: data.data
        })
    }
    else {
        return res.status(500).send({
            message: "500 UserList Error"
        })
    }
}

const register = async(req, res) => {
    let body = req.body;
    let data = await model.register(body);
    if(!data.isError) {
        return res.send({
            message: "200 OK",
            data: data.data
        })
    }
    else {
        return res.status(500).send({
            message: "500 UserList Error"
        })
    }
}

module.exports = {
    isIdDuplicate,
    isNicknameDuplicate,
    register
}