/**
 * Module dependencies.
 */
var express = require('express')
  , passport = require('passport')
  , flash = require('connect-flash')
  , path = require('path')
  , db = require('./models');

/**
 * Configurations
 */
// Bootstrap passport config
require('./config/passport')(passport);

// Create express app
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
  secret: 'minipaste2014',
  cookie: { maxAge: 30*60*10000 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Error handler
app.use(function (err, req, res, next) {
  if(err.status && err.message)
    res.send(err.status, err.message);
  else
    next();
});

// 404 handler
app.use(function (req, res, next) {
  console.log('404')
  res.send(404);
});

/**
 * Routes
 */
var paste = require('./controllers/paste')
  , views = require('./controllers/views')
  , auth = require('./controllers/auth')
  , users = require('./controllers/users');
  
// Auth routes
app.get('/signin', auth.user, auth.signin);
app.get('/signup', auth.user, auth.signup);
app.get('/signout', auth.user, auth.signout);

// User route
app.post('/users', users.create, auth.login);
app.param('userId', users.retrieve);
app.post('/users/session', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
}), auth.session);

// Site routes
app.get('/', auth.user, paste.fork, views.index);  
app.post('/new', auth.user, paste.create, views.redirect);
app.get('/recent', auth.user, paste.list, views.list);
app.get('/paste/:pasteId', auth.user, paste.hits, views.show);
app.get('/paste', auth.requiresLogin, auth.user, paste.user, views.my);
app.param('pasteId', paste.retrieve);

db
  .sequelize
  .sync({ force: true })
  .complete(function(err) {
    //Start the app by listening on <port>
    app.listen(app.get('port'), function () {
      console.log('Express app started on port ' + app.get('port'));
    });
  });

//expose app
exports = module.exports = app;
  
