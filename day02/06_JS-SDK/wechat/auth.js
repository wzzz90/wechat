
const sha1 = require('sha1')

const config = require('../config')
const { getUserAsync, getJsonData, formateMessage } = require('../utils/tools');
const template = require('./template.js');
const reply = require('./reply.js');

module.exports = () => {
    return async (req, res, next) => {
        const { timestamp, nonce, signature, echostr } = req.query;
        const { token } = config;
        //将timestamp，nonce, token放在数组中，然后将数字分割成字符串，再使用sha1进行加密
        //加密后与返回的signature进行匹配，如果一致，证明是微信服务器发来的消息，返回echostr，如果不会，返回error
    
        const shaStr = sha1([timestamp, nonce, token].join(''))
        
        if(req.method == 'GET') {
            if(shaStr === signature) {
                res.end(echostr)
            } else {
                res.end('error')
            }
        } else if(req.method == 'POST') {
            if(shaStr !== signature) {
                res.end('error')
            }
            const xmlData = await getUserAsync(req);
            // <xml><ToUserName><![CDATA[gh_a26bd7d87812]]></ToUserName>微信开发者id
            // <FromUserName><![CDATA[omzr85wgMAwShWcOwhmY12tW10Fs]]></FromUserName>户微信ID
            // <CreateTime>1545982353</CreateTime>发送时间
            // <MsgType><![CDATA[text]]></MsgType>消息类型
            // <Content><![CDATA[222]]></Content>消息内容
            // <MsgId>6639943646846827590</MsgId>消息iD,三天内可通过此ID查看消息内容
            // </xml>
            const jsonData = await getJsonData(xmlData);

            //格式化数据
            // { ToUserName: 'gh_a26bd7d87812',
            // FromUserName: 'omzr85wgMAwShWcOwhmY12tW10Fs',
            // CreateTime: '1545983131',
            // MsgType: 'text',
            // Content: '777',
            // MsgId: '6639946988331383890' }
            const message = formateMessage(jsonData);

            const option = reply(message)

            const replyMessage = template(option)
            
            res.send(replyMessage)
        } else {
            res.end('error')
        }
    
    }
}