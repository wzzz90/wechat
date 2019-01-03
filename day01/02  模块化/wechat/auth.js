
const sha1 = require('sha1')

const config = require('../config')

module.exports = () => {
    return (req, res, next) => {
        console.log(req.query)
        const { timestamp, nonce, signature, echostr } = req.query;
        const { token } = config;
        //将timestamp，nonce, token放在数组中，然后将数字分割成字符串，再使用sha1进行加密
        //加密后与返回的signature进行匹配，如果一致，证明是微信服务器发来的消息，返回echostr，如果不会，返回error
    
        const arr = [timestamp, nonce, token];
        const str = arr.join('');
        const shaStr = sha1(str)
        
        if(shaStr === signature) {
            res.end(echostr)
        } else {
            res.end('error')
        }
    
    }
}