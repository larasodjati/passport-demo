const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

const mongoDb = process.env.MONGO_URI
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'mongo connection error'))
