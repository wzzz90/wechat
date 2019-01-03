const express = require('express');
const auth = require('./wechat/auth.js')

const app = express();

app.use(auth())

app.listen(3001, () => console.log('连接成功'))