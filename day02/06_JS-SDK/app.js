const express = require('express');
const auth = require('./wechat/auth.js')

const app = express();

app.set('views', './views');

app.set('view engine', 'ejs');

app.get('/search', (req, res) => {
    res.render('search')
})

app.use(auth())

app.listen(3001, () => console.log('连接成功'))