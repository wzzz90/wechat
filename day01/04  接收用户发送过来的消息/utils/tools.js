const { parseString } = require('xml2js');

module.exports = {
    getUserAsync(req) {
        return new Promise((resolve, reject) => {
            let xmlStr = ''
            req.on('data', data => {
                xmlStr += data.toString();
            }).on('end', err => {
                resolve(xmlStr)
            })  
        })
        
    },

    getJsonData(xmlData) {
        return new Promise((resolve, reject) => {
            let jsonData = '';
            parseString(xmlData, {trim: true}, (err, data) => {
                if(!err) {
                    resolve(data)
                }else {
                    console.log('getJsonData方法出了问题：'+err)
                }
            })
        })
    },

    formateMessage(jsonData) {
        let message = {};
        
        jsonData = jsonData['xml'];
        if(typeof(jsonData) === 'object') {
            for (const key in jsonData) {
                const val = jsonData[key]
                if(Array.isArray(val) && val.length > 0) {
                    message[key] = val[0]
                }
            }
        }

        return message;
    }

}