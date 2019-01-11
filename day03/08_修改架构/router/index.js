const express = require('express');
const sha1 = require('sha1');

const reply = require('../reply');
const Wechat = require('../wechat/wechat.js');
const { url } = require('../config/index.js');

const Router = express.Router;

const router = new Router();


const wechatApi = new Wechat();

router.get('/search', async (req, res) => {
    
    /*生成js-sdk使用的签名
    1.组合参与签名的四个参数，jsapi_ticket(临时票据)、noncestr(随机字符串)、timestamp(时间戳)、url(当前服务器地址)
    2.将其进行字典序排序，以'&'拼接在一起
    3.进行sha1加密，最重生成signature
    */
    const noncestr = Math.random().toString().split('.')[1]
    const { ticket } = await wechatApi.fetchTicket();
    const timestamp = Date.now();

    const arr = [
        `jsapi_ticket=${ticket}`,
        `noncestr=${noncestr}`,
        `timestamp=${timestamp}`,
        `url=${url}/search`
    ]

    const str = arr.sort().join('&');
    const signature = sha1(str);

    res.render('search', {
        signature,
        noncestr,
        timestamp
    })
})

router.use(reply());


module.exports = router;