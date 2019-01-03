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
        } 
    } else if (message.MsgType === 'image') {
        option.msgType = 'image';
        option.mediaId =  message.MediaId;
    } else if(message.MsgType === 'voice') {
        option.msgType = 'voice';
        option.mediaId =  message.MediaId;
    } else if(message.MsgType === 'video') {
        option.msgType = 'video';
        option.mediaId =  message.MediaId;
    } else if(message.MsgType === 'shortvideo') {
        option.msgType = 'video';
        option.mediaId =  message.MediaId;
    } else if(message.MsgType === 'location') {
        option.msgType = 'location';
        content = `纬度：${message.Location_X} 经度：${message.Location_Y} 地图缩放大小：${message.Scale} 地理位置信息：${message.Label}`
    } else if(message.MsgType === 'event') {
        if(message.Event === 'subscribe') {
            content = '感谢您的订阅';
            if(message.EventKey) {
                content = '用户未关注，扫描特定的二维码关注'
            }
        } else if(message.Event === 'unsubscribe') {
            content = '江湖再见';
            console.log('江湖再见')
        } else if(message.Event === 'LOCATION') {
            content = `纬度：${message.Latitude} 经度：${message.Longitude} 位置精度：${message.Label}`
        } else if (message.Event === 'CLICK') {
            content = `用户点击了${message.EventKey}`
        } else if(message.Event === 'SCAN') {
            content = '用户已关注, 再扫描特定的二维码'
        } else if(message.Event === 'VIEW'){
            content = `点击菜单跳转链接 ${message.EventKey}`
        }

    }
    

    option.content = content;

    return option;
}