const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')
const bcrypt = require('bcryptjs')

const passportLocalStrategy =
new LocalStrategy((username, password, done) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return done(err)
    }
    if (!user) {
      return done(null, false, { message: 'Incorrect username' })
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Incorrect password' })
      }
    })
    // return done(null, user);
  })
})

module.exports = passportLocalStrategy
