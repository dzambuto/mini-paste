module.exports = function(sequelize, DataTypes) {
  var Paste = sequelize.define('Paste', {
    // Annuncio
    'title': { type: DataTypes.STRING, required: true, validate: {notEmpty: true} },
    'content': { type: DataTypes.TEXT, required: true, validate: {notEmpty: true} },
    'expiredAt': { type: DataTypes.DATE, required: true },
    'hits': { type: DataTypes.INTEGER, defaultValue: 0 },
    'exposure': { type: DataTypes.ENUM('public', 'unlisted'), required: true, defaultValue: 'public' }
  }, {
    classMethods: {
      associate: function(models) {
        Paste.belongsTo(models.User);
      }
    }
  });
 
  return Paste;
}