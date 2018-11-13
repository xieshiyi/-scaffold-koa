exports.FilterAliyunSLBHealthCheck = async(ctx, next) => {
    let {
        ip = ''
    } = ctx
    ip = ip.replace(/::\s\S+:/, '')
    const {
        'user-agent': ua = ''
    } = ctx.request.header || {}
    if (ip && !ua && /100.116.\d+.\d+/.test(ip)) {
        ctx.body = 'I am healthy, good good study, day day up'
        return
    }
    await next()
}

exports.simplelog = async(ctx, next) => {
    global.log = console.log
    await next()
}
