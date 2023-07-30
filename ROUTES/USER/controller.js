const model = require("./model");

const getUserList = async (req, res) => {
    console.log("REQ : ", req.params);

    let param = req.params;
    let token = param.token;
    console.log("USER - TOKEN : ", token);

    let data = await model.userList(param, token);
    
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
    getUserList
}

