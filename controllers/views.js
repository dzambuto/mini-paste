
exports.index = function (req, res) {
  var paste = req.paste;
  res.render('index', { page: 'new', paste: paste });
};

exports.edit = function (req, res) {
  var paste = req.paste;
  res.render('paste/edit', { page: 'edit', paste: paste });
};

exports.show = function (req, res) {
  var paste = req.paste;
  res.render('paste/show', { paste: paste, page: 'paste' });
};

exports.list = function (req, res) {
  var pastes = req.pastes;
  res.render('paste/recent', { pastes: pastes, page: 'recent', message: req.flash('error') });
};

exports.my = function (req, res) {
  var pastes = req.pastes;
  res.render('paste/my', { pastes: pastes, page: 'my' });
};

exports.redirect = function (req, res) {
  var paste = req.paste;
  res.redirect('/paste/' + paste.hid);
};