var db = require('../models')
  , LocalStrategy = require('passport-local').Strategy
  , User = db.User;


module.exports = function(passport, config) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.find({
      where: {id: id}
    }).success(function (user) {
      done(null, user);
    }).error(function(err) {
      done(err, null);
    });
  });

  //Use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },
    function(username, password, done) {
      User.find({
        where: { username: username }
      }).success(function (user) {
        if (!user) {
          return done(null, false, { message: 'Unknown user' });
        }
        if (!user.authenticate(password)) {
          return done(null, false, { message: 'Invalid password' });
        }
        return done(null, user);
      }).error(function(err) {
        done(err);
      });
    }
  ));
};