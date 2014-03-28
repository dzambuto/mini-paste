/**
 * Module dependencies.
 */
var express = require('express')
  , passport = require('passport')
  , path = require('path')
  , db = require('./models');

/**
 * Configurations
 */

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
  , views = require('./controllers/views');

// Site routes
app.get('/', paste.fork, views.index);  
app.post('/new', paste.create, views.redirect);
app.get('/recent', paste.list, views.list);
app.get('/paste/:pasteId', paste.hits, views.show);
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
  
