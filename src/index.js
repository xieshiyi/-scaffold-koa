const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const views = require('koa-views')
const session = require("koa-session")
const MongoStore = require("koa-session-mongo2")
const KoaStatic = require("koa-static")
const path = require('path')
const router = require('./routes')
const config = require('../config')

const app = new Koa()

// 服务器log文件
app.use(logger())

app.use(bodyParser({}))

app.use(session({
    store: new MongoStore(config.sessionURL),
    signed: false,
    // cookie过期时间，由浏览器负责到时清除，单位毫秒
    maxAge: 24 * 60 * 60 * 1000
}, app))
const {
    SessStoreUser
} = require('./middleware/auth')
// 关联使用session储存登录的账号信息
app.use(SessStoreUser)

app.use(views(path.join(__dirname, '/views'), {
    map: {
        html: 'lodash'
    }
}));

global._ = require('lodash')
global.models = require('./models')

let env = process.env.NODE_ENV || 'development';
if (env !== 'development') {
    // 系统级别的log记录，不是服务器的记录，记在log表中
    const { Record } = require('./middleware/log')
    app.use(Record)
}

// 使用router
app.use(router.routes(), router.allowedMethods())

console.log('启动端口：', config.port)
app.listen(config.port)
