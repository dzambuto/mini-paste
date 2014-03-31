var db = require('../models')
  , User = db.User;

exports.user = function (req, res, next) {
  res.locals.user = req.user;
  next();
};

exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

exports.havePermission = function (req, res, next) {
  var user = req.user
    , paste = req.paste;
  
  if(!user || user.id != paste.UserId) {
    return res.send(401, 'User is not authorized');
  }
  
  next();
};

exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};

exports.session = function(req, res) {
  res.redirect('/');
};

exports.signin = function(req, res) {
  res.render('auth/signin', {
      page: 'signin'
    , message: req.flash('error')
  });
};

exports.signup = function(req, res) {
  res.render('auth/signup', {
      page: 'signup'
    , message: req.flash('error')
  });
};

exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

exports.login = function (req, res, next) {
  var user = req.user;
  req.logIn(user, function(err) {
    if (err) return next(err);
    return res.redirect('/');
  });
};