
var db = require('../models')
  , Paste = db.Paste
  , User = db.User
  , Hashids = require("hashids")
  , hashids = new Hashids("mini-paste-clone");


exports.create = function (req, res, next) {
  var body = req.body
    , user = req.user
    , paste = Paste.build(body)
    , now = Date.now();
  
  // Expire Date
  paste.expiredAt = body.expiration == 1 ? now + 1000*60*60 : now + 1000*60*10;
  
  paste.save().success(function () {
    paste.hid = hashids.encrypt(paste.id);
    req.paste = paste;
    
    if(!user) return next();
    
    user
      .addPaste(paste)
      .success(function () {
        next();
      });
  }).error(function (err) {
    next(err);
  });
};

exports.update = function (req, res, next) {
  var paste = req.paste
    , attrs = req.body
    , now = Date.now();
  
  // Expire Date
  paste.expiredAt = attrs.expiration == 1 ? now + 1000*60*60 : now + 1000*60*10;
      
  paste
    .updateAttributes(attrs)
    .success(function () {
      next();
    });
};

exports.remove = function (req, res, next) {
  var paste = req.paste;
  
  paste
    .destroy()
    .success(function () {
      next();
    });
};

exports.list = function (req, res, next) {
  var now = new Date();
  
  Paste
    .findAll({ 
        where: {exposure: 'public', expiredAt: { gt: now }}
      , order: [['hits', 'DESC'], ['createdAt', 'DESC']]
      , limit: 10
      , include: [{ model: User }]
    })
    .success(function (pastes) {
      pastes.forEach(function (paste) {
        paste.hid = hashids.encrypt(paste.id);
      });
      req.pastes = pastes;
      next();
    })
    .error(function (err) {
      next(err);
    });
};

var retrieve = exports.retrieve = function (req, res, next, hid) {
  var id = hashids.decrypt(hid)
    , now = new Date();
  
  Paste
    .find({ 
      where: {id: id, expiredAt: { gt: now } }
      , include: [{ model: User }]
    })
    .success(function (paste) {
      if(!paste) {
        var err = new Error('Not found');
        err.status = 404;
        return next(err);
      }
      paste.hid = hid;
      req.paste = paste;
      next();
    })
    .error(function (err, paste) {
      next(err);
    });
};

exports.user = function (req, res, next) {  
  var user = req.user;
  
  user
    .getPastes()
    .success(function (pastes) {
      pastes.forEach(function (paste) {
        paste.hid = hashids.encrypt(paste.id);
      });
      req.pastes = pastes;
      next();
    })
    .error(function (err) {
      next(err);
    });
};

exports.fork = function (req, res, next) {
  var id = req.query.id && hashids.decrypt(req.query.id)
    , clone = req.paste = { content: '', title: '', exposure: 'public' }
    , now = new Date();
  
  if(!id) return next();
  
  Paste
    .find({ 
      where: {id: id, expiredAt: { gt: now } }
      , include: [{ model: User }]
    })
    .success(function (paste) {
      if(!paste) {
        var err = new Error('Not found');
        err.status = 404;
        return next(err);
      }
      clone.content = paste.content;
      clone.title = paste.title;
      next();
    })
    .error(function (err, paste) {
      next(err);
    });
};

exports.hits = function (req, res, next) {
  var paste = req.paste;
  paste.hits++;
  paste
    .save()
    .success(function () {
      next();
    }).error(function (err) {
      next(err);
    });
};

exports.json = function (req, res) {
  var values = req.parse || res.parses || {};
  res.json(values);
};