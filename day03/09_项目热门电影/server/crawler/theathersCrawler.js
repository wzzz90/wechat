const puppeteer = require('puppeteer');

const url = 'https://movie.douban.com/cinema/nowplaying/shanghai/';


module.exports = async () => {
    //1.打开浏览器
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        headless: true,//以无头浏览器的形式打开浏览器
    });
    //2.创建tab页
    const page = await browser.newPage();
    //3.跳往指定页面
    await page.goto(url, {
        waitUntil: 'networkidle2'//等待网络空闲时加载页面
    });
    //4.等待页面加载完成，开始爬取数据
    //开启延时器，2S

    await timeout;

    const result = await page.evaluate( () => {
        let result = []; 
        const $list = $('#nowplaying>.mod-bd>.lists>.list-item');

        for (let index = 0; index < 8; index++) {
            const element = $list[index];

            const title = $(element).data('title');
            const score = $(element).data('score');
            const duration = $(element).data('duration');
            const director = $(element).data('director');
            const actors = $(element).data('actors');
            const href = $(element).find('.poster>a').attr('href');
            const image = $(element).find('.poster>a>img').attr('src');

            result.push({
                title,
                score,
                duration,
                director,
                actors,
                href,
                image
            })
            
        }
        
        return result;
    })


    for (let index = 0; index < result.length; index++) {
        let item = result[index];

        const url = item.href;
        await page.goto(url, {
            waitUntil: 'networkidle2'//等待网络空闲时加载页面
        });

        let itemResult = await page.evaluate(() => {
            
            const $genre = $('[property="v:genre"]');
            let genre = [];
            for (var i=0; i<$genre.length; i++) {
                genre.push($('[property="v:genre"]').eq(i).text())
            }

            let summary = $('[property="v:summary"]').text().replce(/\s+/g, '');

            return {
                genre,
                summary
            };
        })

        item.genre = itemResult.genre;
        item.summary = itemResult.summary;
    }
    
    console.log(result)

    //5.关闭浏览器
    await browser.close();
} 

function timeout() {
    return new Promise( resolve => setTimeout(resolve, 2000))
}