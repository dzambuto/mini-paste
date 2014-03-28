
var mongoose = require('mongoose')
  , Paste = mongoose.model('Paste')
  , Hashids = require("hashids")
  , hashids = new Hashids("mini-paste-clone");;


exports.create = function (req, res, next) {
  var paste = new Paste(req.body);
  paste.save(function (err) {
    if(err) return next(err);
    paste.hid = hashids.encryptHex(paste._id);
    req.paste = paste;
    next();
  })
};

exports.list = function (req, res, next) {
  var now = new Date();
  
  Paste
    .find({exposure: 'public', expiredAt: { $gt: now }})
    .sort('-hits -createdAt')
    .limit(10)
    .exec(function (err, pastes) {
      if(err) return next(err);
      pastes.forEach(function (paste) {
        paste.hid = hashids.encryptHex(paste._id);
      });
      req.pastes = pastes;
      next();
    });
};

var retrieve = exports.retrieve = function (req, res, next, hid) {
  var id = hashids.decryptHex(hid)
    , now = new Date();
  
  Paste
    .findOne({_id: id, expiredAt: { $gt: now }})
    .exec(function (err, paste) {
      if(err) return next(err);
      if(!paste) {
        var err = new Error('Not found');
        err.status = 404;
        return next(err);
      }
      paste.hid = hid;
      req.paste = paste;
      next();
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
  paste.save(function (err) {
    next(err);
  });
};

exports.json = function (req, res) {
  var values = req.parse || res.parses || {};
  res.json(values);
};