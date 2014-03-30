var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true, required: true, validate: { notEmpty: true, isAlphanumeric: true } },
    email: { type: DataTypes.STRING, unique: true, required: true, validate: { notEmpty: true, isEmail: true } },
    hashed_password: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {
    getterMethods: {
      password:  function() {
        return this.hashed_password;
      }
    },
    setterMethods: {
      password: function(password) {
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
      }
    },
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Paste);
      }
    },
    instanceMethods: {
      authenticate : function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
      },
      encryptPassword: function(password){
        if (!password) return '';
        return crypto.createHash('sha512').update(password).update(this.salt).digest('base64');
      },
      makeSalt: function() {
        return crypto.randomBytes(16).toString('base64');
      }
    }
  });

  return User;
};