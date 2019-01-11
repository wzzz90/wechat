const { url } = require('../config/index.js');

module.exports = {
    "button":[
        {    
             "type":"view",
             "name":"硅谷电影",
             "url":`${url}/movie`
         },
        {    
            "type":"view",
            "name":"语音识别",
            "url":`${url}/search`
        },
        {
            "name": "戳我", 
            "sub_button": [
                {
                    "type": "view", 
                    "name": "官网", 
                    "url": `${url}`
                 }, 
                {
                    "type": "click", 
                    "name": "帮助", 
                    "key": "help"
                }, 
            ]
        }
    ]
}