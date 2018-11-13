const errors = require('./errors')
const schedule = require('node-schedule')
const moment = require('moment')
const fs = require('fs')

exports.getUuid = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + s4() + s4() +
        s4() + s4() + s4() + s4();
};

exports.getResponse = function (success, e) {
    if (success) {
        return {
            data: e || {},
            success: true
        };
    } else {
        return {
            success: false,
            error: e || '',
            errorMsg: errors[e] || '未知错误！'
        };
    }
};


// 定时任务 每天把日志文件分类归集
exports.LogFileArrange = async () => {
    schedule.scheduleJob({
        hour: 0,
        minute: 3,
    }, () => {
        const dir = moment().format('YYYY-MM-DD-HH-mm')
        console.log('日志更新了')
        fs.mkdir(`./logs/${dir}`, () => {
            ['out', 'access', 'error'].map(itm => {
                const readerStream = fs.createReadStream(`./logs/${itm}.log`);
                let data = '';
                readerStream.setEncoding('UTF8');
                readerStream.on('data', chunk => data += chunk);
                readerStream.on('end', () => {
                    let writerStream = fs.createWriteStream(`./logs/${dir}/${itm}.log`);
                    writerStream.write(data, 'UTF8');
                    writerStream.end();
                    writerStream.on('finish', () => {
                        writerStream = fs.createWriteStream(`./logs/${itm}.log`);
                        writerStream.write('');
                        writerStream.end();
                    });
                });
            })
        })
    })
}

// 校验手机号码格式是否正确
exports.checkPhone = function (phone) {
    if (!phone) return false
    const reg = new RegExp(/^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/);
    if (!reg.test(+phone)) {
        return false
    } else {
        return true
    }
}

// 获取ip地址
exports.getAcessRealIP = (req) => {
    console.log('----->', req.headers['x-forwarded-for'])
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress
}

exports.getXMLNodeValue = (node_name, xml) => {
    let tmp = xml.split("<" + node_name + "><![CDATA[")
    if (typeof tmp === 'string') {
        return ''
    }
    if (tmp && tmp.length && tmp[0] && tmp[1]) {
        return tmp[1].split("]]></" + node_name + ">")[0]
    }
    return '';
}