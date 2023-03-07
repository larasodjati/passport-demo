const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions'
})

module.exports = store
