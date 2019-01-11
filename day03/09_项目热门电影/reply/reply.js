module.exports = message => {
    let option = {
        toUserName: message.FromUserName,
        fromUserName: message.ToUserName,
        createTime: Date.now(),
        msgType: 'text'
    }

    let content = '您在说什么，我不太明白！';

    if(message.MsgType === 'text') {
        if(message.Content === '1') {
            content = '英雄联盟';
        } else if(message.Content === '2') {
            content = '王者荣耀';
        } else if(message.Content.match('唉')) {
            content = '年纪轻轻叹什么气';
        } else if(message.Content.match('爱')) {
            content = '我也爱你';
        } else if(message.Content.match('田') || message.Content.match('艳') || message.Content.match('茶') || message.Content === '田艳茶') {
            const arr = ['所有温暖如春的句子里都藏着你的脸，亲爱的', '唇齿深渊，眉眼之间，我喜欢你年复一年。', '我想陪你看遍世间美景, 然后告诉你, 它们都不及你万分之一', '世界都不大，我可以哪里都不去，我可以在这里，只看着你，直到世界老去。', '我的人生从来没有出现过奇迹，直到我遇见了你。', '你名字就那么几笔，却深深刻进我心底。', '我前半生三次最强烈的心跳, 分别发生在上课被老师点名, 下楼梯时一脚踩空, 和遇见你的时候']
            let num = Math.floor(Math.random()*10) || 0;
            
            if(num > 6) {
                num = 6
            }
            
            content = arr[num];
        } 
    } else if(message.MsgType === 'voice') {
        option.msgType = 'voice';
        option.mediaId =  message.MediaId;
    } else if(message.MsgType === 'event') {
        if(message.Event === 'subscribe') {
            console.log(1)
            content = '欢迎您关注豆瓣电影公众号~ \n'+
                    '回复 首页 就能看到豆瓣电影预告片页面 \n'+
                    '回复 热门 就能看到最新最热门电影信息 \n'+
                    '回复 文本 就能查看指定电影信息 \n'+
                    '回复 语音 就能查看指定电影信息 \n'+    
                    '也可以点击下方菜单按钮，来了解豆瓣电影公众号';
            if(message.EventKey) {
                content = '用户未关注，扫描特定的二维码关注'
            }
        } else if(message.Event === 'unsubscribe') {
            content = '江湖再见';
            console.log('江湖再见')
        } else if (message.Event === 'CLICK') {
            content = '您可以按照以下提示进行操作 \n'+
            '回复 首页 就能看到豆瓣电影预告片页面 \n'+
            '回复 热门 就能看到最新最热门电影信息 \n'+
            '回复 文本 就能查看指定电影信息 \n'+
            '回复 语音 就能查看指定电影信息 \n'+    
            '也可以点击下方菜单按钮，来了解豆瓣电影公众号';
        }

    }
    

    option.content = content;

    return option;
}