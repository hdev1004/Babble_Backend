const model = require("./model");

const getBoardKindList = async (req, res) => {
    let param = req.params;
    console.log(param);
 
    let data = await model.getBoardKindList(param);
    if(!data.isError) {
        return res.send({
            message: "200 OK",
            data: data.data
        })
    }
    else {
        return res.status(500).send({
            message: "500 getBoardKindList Error"
        })
    }
}

const getBoardList = async(req, res) => {
    let param = req.params;
    console.log(param);
 
    let data = await model.getBoardList(param);
    if(!data.isError) {
        return res.send({
            message: "200 OK",
            data: data.data
        })
    }
    else {
        return res.status(500).send({
            message: "500 getBoardList Error"
        })
    }
}

const getBoardContents = async(req, res) => {
    let param = req.params;
    console.log(param);
 
    let data = await model.getBoardContents(param);
    if(!data.isError) {
        return res.send({
            message: "200 OK",
            data: data.data
        })
    }
    else {
        return res.status(500).send({
            message: "500 getBoardContents Error"
        })
    }
}

const posting =  async(req, res) => {
    let body = req.body;
    console.log(body);

    let data = await model.posting(body);
    if(!data.isError) {
        return res.send({
            message: "200 OK",
            data: data.data
        })
    }
    else {
        return res.status(500).send({
            message: "500 Posting Error"
        })
    }
}


module.exports = {
    getBoardList,
    getBoardKindList,
    getBoardContents,
    posting
}