const authMiddleware = (req, res, next) => {
  if (!req.user) {
    if (!req.session.messages) {
      req.session.messages = []
    }
    req.session.messages.push("You can't access that page before logon.")
    res.redirect('/')
  } else {
    next()
  }
}

module.exports = authMiddleware
