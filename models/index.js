var fs = require('fs')
  , path = require('path')
  , Sequelize = require('sequelize')
  , sequelize = new Sequelize('minipaste', 'root', 'password', {
    host: '127.0.0.1',
    define: { timestamps: true, paranoid: true, underscore: true, charset: 'utf8' },
    sync: { force: true },
    syncOnAssociation: true
  })
  , db = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  });

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;