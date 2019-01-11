const theathersCrawler = require('./crawler/theathersCrawler.js');

(async () => {
    const data = await theathersCrawler();

    console.log(data)
})()