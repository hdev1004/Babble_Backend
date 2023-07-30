const model = require("./model");

//📕 GET
const getSalt = async (req, res) => {
    let param = req.params;
    let token = param.id;
    console.log("LOGIN - TOKEN : ", token);

    let data = await model.getSalt(param);
    
    if(!data.isError) {
        return res.send({
            message: "200 OK",
            data: data.data

        })
    }
    else {
        return res.status(500).send({
            message: "500 Salt Error"
        })
    }
}

const verifyToken = async (req, res) => {
    let param = req.params;
    let headers = req.headers;

    let data = await model.verifyToken(param, headers);

    if(!data.isError) {
        return res.send({
            message: "200 OK",
            data: data.data,
            access_token: data.access_token,
            refresh_token: data.refresh_token
        })
    }
    else {
        return res.status(500).send({
            message: "500 Verify Error",
            data: data.data
        })
    }
}



//📕 POST
/**
 * 로그인 확인하는 함수
 * @param {*} req 
 * @param {*} res 
 */
const loginCheck = async (req, res) => {
    let body = req.body;
    console.log("LOGIN CHECK : ", body);
    
    let data = await model.loginCheck(body);
    if(!data.isError) {
        return res.send({
            message: "200 OK",
            data: data.data
        })
    }
    else {
        return res.status(500).send({
            message: "500 LoginCheck Error",
            data: data.data
        })
    }
}


const tokenGenerator = async (req, res) => {
    let header = req.headers;
    let body = req.body;

    let data = await model.tokenGenerator(header, body);
    if(!data.isError) {
        return res.send({
            message: "200 OK",
            data: data.data
        })
    }
    else {
        return res.status(500).send({
            message: "500 LoginCheck Error",
            data: data.data
        })
    }
    
}

module.exports = {
    getSalt,
    verifyToken,
    loginCheck,
    tokenGenerator
}

