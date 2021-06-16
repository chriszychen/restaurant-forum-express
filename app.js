const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const port = 3000

app.engine('hbs', handlebars({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app
