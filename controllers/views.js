
exports.index = function (req, res) {
  var content = req.paste ? req.paste.content : '';
  res.render('index', { page: 'new', content: content });
};

exports.show = function (req, res) {
  var paste = req.paste;
  res.render('paste/show', { paste: paste, page: 'paste' });
};

exports.list = function (req, res) {
  var pastes = req.pastes;
  res.render('paste/recent', { pastes: pastes, page: 'recent' });
};

exports.my = function (req, res) {
  var pastes = req.pastes;
  res.render('paste/my', { pastes: pastes, page: 'my' });
};

exports.redirect = function (req, res) {
  var paste = req.paste;
  res.redirect('/paste/' + paste.hid);
};