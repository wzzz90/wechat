//https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
const rp = require('request-promise-native')
const { writeFile, readFile } = require('fs');

const config = require('../config')
const { appID, appsecret } = config;
const menu = require('./menu.js');
const { writeFileAsync, readFileAsync } = require('../utils/tools.js')

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
        return writeFileAsync(accessToken, 'accessToken.txt')
    }

    readAccessToken() {
        return readFileAsync('accessToken.txt')
    }


    isValidAccessToken(data) {
        if(!data && !data.access_token && !data.expires_in) {
            return false;
        }

        return data.expires_in > Date.now();
    }

    fetchAccessToken() {
        if(this.access_token && this.expires_in && this.isValidAccessToken(this)) {
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



    getTicket() {
        return new Promise(async (resolve, reject) => {
            const data = await this.fetchAccessToken();

            const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${data.access_token}&type=jsapi`

            rp({method:'GET', url, json: true})
            .then(res => {
                
                resolve({ticket: res.ticket, expires_in: Date.now() + (res.expires_in - 300) * 1000})
            })
            .catch(err => {
                reject('getTicket方法出了问题：'+ err)
            })
        })
        
    }

    saveTicket(ticket) {
        return writeFileAsync(ticket, 'ticket.txt') 
    }

    readTicket() {
        return readFileAsync('ticket.txt')
        
    }


    isValidTicket(data) {
        if(!data && !data.ticket && !data.expires_in) {
            return false;
        }

        return data.expires_in > Date.now();
    }

    fetchTicket() {
        if(this.ticket && this.ticket_expires_in && this.isValidTicket(this)) {
            return Promise.resolve({
                ticket: this.ticket,
                expires_in: this.expires_in
            })
        }
        
        return this.readTicket()
            .then(async res => {
                if(this.isValidTicket(res)) {
                    return Promise.resolve(res)
                } else {
                    const res = await this.getTicket();
                    await this.saveTicket(res)
                    return Promise.resolve(res)
                }
            })
            .catch(async err => {
                const res = await this.getTicket();
                await this.saveTicket(res)
                return Promise.resolve(res)
            }) 
            .then(res => {
                this.ticket = res.ticket;
                this.ticket_expires_in = res.expires_in;
                return Promise.resolve(res)
            })   
    }


    createMenu(menu) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await this.fetchAccessToken();
                
                const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${data.access_token}`;
                
                const result = await rp({method: 'POST', url, json: true, body: menu});

                resolve(result)
            } catch (error) {
                reject('createMenu方法除了问题'+error)
            }
        })
    }


    deleteMenu() {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await this.fetchAccessToken();
                console.log(data)
                const url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${data.access_token}`;

                const result = await rp({method: 'GET', url, json: true});

                resolve(result)
            } catch (error) {
                reject('deleteMenu方法除了问题'+error)
            }
        })
    }

}

module.exports = Wechat;


(async () => {
    const w = new Wechat();
    let res = await w.deleteMenu();
    
    console.log(res, 'deleteMenu成功')

    res = await w.createMenu(menu);

    console.log(res, 'createMenu成功')

    const data = await w.fetchTicket();
    
})()

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
