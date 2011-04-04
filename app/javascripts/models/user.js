//= require "../model"

var User = new JS.Class(Model, {
  extend: {
    resource: 'user',
    belongs_to: ['person'],
    has_many: ['tills']
  }
});