const jwt = require('jsonwebtoken');

const verifyToken = (authorization) => {
  // 인증 완료
  try {
    res = jwt.verify(authorization, process.env.JWT_SECRET)
    return true;
  }
  
  // 인증 실패 
  catch(error) {
    if (error.name === 'TokenExpireError') {
      //토큰 만료
      return false;
    }
    else {
        //유효하지 않은 토큰
        return false;
    }
  }
}

const tokenGenerator = (payload, time) => {
    let token = null;
    try {
      // jwt.sign() 메소드: 토큰 발급 
      token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: time + 'm', //1분
        issuer: '토큰 발급자'
      });
    } catch(error) {
        console.log(error);
        return "error";
    }

    return token;
}
    

module.exports = {
    verifyToken,
    tokenGenerator
}