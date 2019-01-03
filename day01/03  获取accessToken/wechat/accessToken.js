//https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
const rp = require('request-promise-native')
const { writeFile, readFile } = require('fs');

const config = require('../config')
const { appID, appsecret } = config;


class Wechat {
    constructor () {

    }

    getAccessToken() {
        return new Promise((resolve, reject) => {
            const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`
            rp({method:'GET', url, json: true})
            .then(res => {
    
                res.expires_in = Date.now() + (res.expires_in - 300) * 1000;
                
                resolve(res)
            })
            .catch(err => {
                reject('getAccessToken方法出了问题：'+ err)
            })
        })
        
    }

    saveAccessToken(accessToken) {
        return new Promise((resolve, reject) => {
            accessToken = JSON.stringify(accessToken)
            writeFile('./accessToken.txt', accessToken, err => {
                if(!err) {
                    console.log('文件保存成功')
                    resolve()
                } else {
                    reject('saveAccessToken出了问题 :'+err)
                }
            })
        })
        
    }

    readAccessToken() {
        return new Promise((resolve, reject) => {
            readFile('./accessToken.txt', (err, data) => {
                if(!err) {
                    console.log('文件读取成功')
                    data = JSON.parse(data)
                    resolve(data)
                } else {
                    reject('readAccessToken出了问题 :'+err)
                }
            })
        })
        
    }


    isValidAccessToken(data) {
        if(!data && !data.access_token && !data.expires_in) {
            return false;
        }

        return data.expires_in > Date.now();
    }

    fetchAccessToken() {
        if(this.access_token && this.expires_in && isValidAccessToken(this)) {
            return Promise.resolve({
                access_token: this.access_token,
                expires_in: this.expires_in
            })
        }
        
        return this.readAccessToken()
            .then(async res => {
                if(this.isValidAccessToken(res)) {
                    return Promise.resolve(res)
                } else {
                    const res = await this.getAccessToken();
                    await this.saveAccessToken(res)
                    return Promise.resolve(res)
                }
            })
            .catch(async err => {
                const res = await this.getAccessToken();
                await this.saveAccessToken(res)
                return Promise.resolve(res)
            }) 
            .then(res => {
                console.log(res)
                this.access_token = res.access_token;
                this.expires_in = res.expires_in
                return Promise.resolve(res)
            })   
    }

}



const w = new Wechat();
w.fetchAccessToken()


// new Promise((resolve, reject) => {
//     //先读取accessToKEN.txt文件
//     w.readAccessToken()
//     .then(res => {
//         if(w.isValidAccessToken(res)) {
//             resolve(res)
//         } else {
//             w.getAccessToken()
//             .then( res => {
//                 w.saveAccessToken(res)
//                 .then(() => {
//                     resolve(res)
//                 })
//             })
//         }
//     })
//     .catch(err => {
//         w.getAccessToken()
//         .then( res => {
//             w.saveAccessToken(res)
//             .then(() => {
//                 resolve(res)
//             })
//         })
//     })    
// })
// .then(res => {
//     console.log(res)
// })
