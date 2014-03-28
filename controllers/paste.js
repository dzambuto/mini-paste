
var db = require('../models')
  , Paste = db.Paste
  , Hashids = require("hashids")
  , hashids = new Hashids("mini-paste-clone");


exports.create = function (req, res, next) {
  var body = req.body
    , paste = Paste.build(body)
    , now = Date.now();
  
  // Expire Date
  paste.expiredAt = body.expiration ? now + 1000*60*60 : now + 1000*60*10;
  
  paste.save().success(function () {
    paste.hid = hashids.encrypt(paste.id);
    req.paste = paste;
    next();
  }).error(function (err) {
    next(err);
  });
};

exports.list = function (req, res, next) {
  var now = new Date();
  
  Paste
    .findAll({ 
        where: {exposure: 'public', expiredAt: { gt: now }}
      , order: [['hits', 'DESC'], ['createdAt', 'DESC']]
      , limit: 10
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
      where: {id: id, expiredAt: { gt: now }}
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

exports.fork = function (req, res, next) {
  var hid = req.query.id;
  if(!hid) return next();
  retrieve(req, res, next, hid);
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