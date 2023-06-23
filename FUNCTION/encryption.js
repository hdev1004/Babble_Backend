
const CryptoJS = require("crypto-js");
const iterations = 44531;

const createSalt = () => {
    let salt = CryptoJS.lib.WordArray.random(64).toString(CryptoJS.enc.Base64);
    return salt;
}

const encryptPassword = async (password, salt) => {
    const encryptedPassword = await CryptoJS.PBKDF2(password, salt, {
      keySize: 16,
      iterations: iterations
    }).toString(CryptoJS.enc.Base64);
  
    return {encryptedPassword, salt};
}

const validatePassword = async (password, salt, userPassword) => {
    const encryptedPassword = await CryptoJS.PBKDF2(password, salt, {
        keySize: 16,
        iterations: iterations
    }).toString(CryptoJS.enc.Base64);

    return encryptedPassword === userPassword;
};

module.exports = {
    createSalt,
    encryptPassword,
    validatePassword
}