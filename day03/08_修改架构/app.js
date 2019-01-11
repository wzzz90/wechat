const express = require('express');

const router = require('./router')
const app = express();


app.set('views', './views');

app.set('view engine', 'ejs');

app.use(router)

app.listen(3001, () => console.log('连接成功'))