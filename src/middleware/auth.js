/*
	auth中间件的目的就是抽象出一些统一的验权方法，作为中间件来保证用户验权
*/
const {
    getResponse
} = require('../helpers')

const SessStoreUser = async(ctx, next) => {

    const {

    } = ctx.session

    ctx.state = {

    }

    await next()
}



module.exports = {
    SessStoreUser
}
