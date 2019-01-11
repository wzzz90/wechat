//处理模板
module.exports = option => {
    let replyMesage = `<xml>
    <ToUserName><![CDATA[${option.toUserName}]]></ToUserName>
    <FromUserName><![CDATA[${option.fromUserName}]]></FromUserName>
    <CreateTime>${option.createTime}</CreateTime>
    <MsgType><![CDATA[${option.msgType}]]></MsgType>
    `;

    if(option.msgType == 'text') {
        replyMesage += `
            <Content><![CDATA[${option.content}]]></Content>`
    } else if(option.msgType == 'image') {
        replyMesage += `<Image><MediaId><![CDATA[${option.mediaId}]]></MediaId></Image>`
    } else if(option.msgType == 'voice') {
        replyMesage += `<Voice><MediaId><![CDATA[${option.mediaId}]]></MediaId></Voice>`
    } else if(option.msgType == 'video') {
        replyMesage += `<Video>
                        <MediaId>< ![CDATA[${option.mediaId}] ]></MediaId>
                        <Title>< ![CDATA[${option.title}] ]></Title>
                        <Description>< ![CDATA[${option.description}] ]></Description>
                        </Video> `
    } else if(option.msgType == 'music') {
        replyMesage += `<Music>
                        <Title>< ![CDATA[${option.title}] ]></Title>
                        <Description>< ![CDATA[${option.description}] ]></Description>
                        <MusicUrl>< ![CDATA[${option.musicUrl}] ]></MusicUrl>
                        <HQMusicUrl>< ![CDATA[${option.hqMusicUrl}] ]></HQMusicUrl>
                        <ThumbMediaId>< ![CDATA[${option.thumbMediaId}] ]></ThumbMediaId>
                        </Music>`
    } else if(option.msgType == 'news') {
        replyMesage += `<ArticleCount>${option.content.length}</ArticleCount>
                        <Articles>`
            option.content.forEach(item => {
                replyMesage +=  `<item>
                                <Title>< ![CDATA[${item.title}] ]></Title>
                                <Description>< ![CDATA[${item.description}] ]></Description>
                                <PicUrl>< ![CDATA[${item.picUrl}] ]></PicUrl>
                                <Url>< ![CDATA[${item.url}] ]></Url>
                                </item>`
            })           
                            
        replyMesage += `</Articles>`
    }

    replyMesage += `</xml>`

    return replyMesage;

}