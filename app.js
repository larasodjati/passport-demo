require('dotenv').config()
const express = require('express')
const app = express()
const session = require('express-session')
const passport = require('passport')
const passportLocalStrategy = require('./middleware/authPassport')
const bcrypt = require('bcryptjs')
const connectDB = require('./db/connect')
const User = require('./models/User')
const authMiddleware = require('./middleware/auth')
const store = require('./db/store')

// Catch errors
store.on('error', function (error) {
  console.log(error)
})

app.set('view engine', 'ejs')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.urlencoded({ extended: false }))

app.use(function (req, res, next) {
  res.locals.currentUser = req.user
  next()
})

// routes
app.get('/', (req, res) => {
  let messages = []
  if (req.session.messages) {
    messages = req.session.messages
    req.session.messages = []
  }
  res.render('pages/index', { messages })
})

app.get('/sign-up', (req, res) => res.render('pages/sign-up-form'))

app.post('/sign-up', async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    await User.create({ username: req.body.username, password: hashedPassword })
    res.redirect('/')
  } catch (err) {
    return next(err)
  }
})

app.post(
  '/log-in',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureMessage: true
  })
)

app.get('/log-out', (req, res) => {
  req.session.destroy(function (err) {
    res.redirect('/')
  })
})

app.get('/restricted', authMiddleware, (req, res) => {
  if (!req.session.pageCount) {
    req.session.pageCount = 1
  } else {
    req.session.pageCount++
  }
  res.render('pages/restricted', { pageCount: req.session.pageCount })
})

// passport function
passport.use(passportLocalStrategy)
passport.serializeUser(function (user, done) {
  done(null, user.id)
})
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})

// server
const port = 5000
const start = async () => {
  try {
    await connectDB
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}
start()
