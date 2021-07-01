const routes = require('./routes.js')
const apis = require('./apis.js')

module.exports = (app) => {
  app.use('/', routes)
  app.use('/api', apis)
}
