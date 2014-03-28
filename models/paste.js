var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

/**
 * Schema
 */  
var PasteSchema = new Schema({
    content: { type: String, required: true }
  , title: { type: String, required: true }
  , hits: { type: Number, default: 0}
  , expiration: { type: Number, min: 0, max: 1, default: 0 }
  , createdAt: { type: Date, default: Date.now }
  , expiredAt: { type: Date, default: expireDefault }
  , exposure: { type: String, enum: ['public', 'unlisted'], default: 'public' }
});

/**
 * Validations
 */
var validatePresenceOf = function(value) {
  return value && value.length;
};

PasteSchema.path('content').validate(function(content) {
  return validatePresenceOf(content);
}, 'Content cannot be blank');

PasteSchema.path('title').validate(function(title) {
  return validatePresenceOf(title);
}, 'Title cannot be blank');

/**
 * Pre-save hook
 */
PasteSchema.pre('save', function(next) {
  if (!this.isNew) return next();
  this.hits = 0;
  this.expiredAt = this.expiration ? Date.now() + 1000*60*60 : Date.now() + 1000*60*10;
  next();
});

mongoose.model('Paste', PasteSchema);

/**
 * Utilities
 */
function expireDefault() {
  return Date.now() + 1000*60*10;
}