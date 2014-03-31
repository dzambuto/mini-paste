var db = require('../models')
  , User = db.User
  , Hashids = require("hashids")
  , hashids = new Hashids("mini-paste-clone");

exports.create = function (req, res, next) {
  User
    .create(req.body)
    .success(function (user) {
      req.user = user;
      next();
    })
    .error(function (err) {
      if(err.code && err.code == 'ER_DUP_ENTRY') {
        req.flash('error', 'Username already taken');
      }
      else {
        req.flash('error', 'Unknown error');
      } 
      res.redirect('/signup');
    });
};

exports.retrieve = function(req, res, next, hid) {
  var id = hashids.decrypt(hid);
  User
    .find({
      where: {_id: id}
    })
    .success(function (user) {
      if(!user) {
        var err = new Error('Not found');
        err.status = 404;
        return next(err);
      }
      user.hid = hid;
      req.profile = user;
      next();
    }).error(function(err) {
      next(err);
    });
};