
exports.index = function (req, res) {
  var content = req.paste ? req.paste.content : '';
  res.render('index', { page: 'new', content: content });
};

exports.show = function (req, res) {
  var paste = req.paste;
  res.render('paste', { paste: paste, page: 'paste' });
};

exports.list = function (req, res) {
  var pastes = req.pastes;
  res.render('recent', { pastes: pastes, page: 'recent' });
};

exports.redirect = function (req, res) {
  var paste = req.paste;
  res.redirect('/paste/' + paste.hid);
};