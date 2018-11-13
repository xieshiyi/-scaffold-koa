const Router = require('koa-router')
const router = Router({
	prefix: '/'
})


const routes = [ ]

for (route of routes) {
	router.use(route.routes(), route.allowedMethods())
}

module.exports = router
