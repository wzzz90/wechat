const { parseString } = require('xml2js');
const { writeFile, readFile } = require('fs');
const { resolve } = require('path')
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
    },

    writeFileAsync(data, fileName) {
        const filePath = resolve(__dirname, fileName);
        data = JSON.stringify(data)

        return new Promise((resolve, reject) => {
            writeFile(filePath, data, err => {
                if(!err) {
                    console.log('文件保存成功')
                    resolve()
                } else {
                    reject('writeFileAsync出了问题 :'+err)
                }
            })
        })
    },

    readFileAsync(fileName) {
        const filePath = resolve(__dirname, fileName);
        return new Promise((resolve, reject) => {
            readFile(filePath, (err, data) => {
                if(!err) {
                    data = JSON.parse(data)
                    resolve(data)
                } else {
                    reject('readFileAsync出了问题 :'+err)
                }
            })
        })
    }

}