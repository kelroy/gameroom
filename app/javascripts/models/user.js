//= require "../model"

var User = new JS.Class(Model, {
  extend: {
    resource: 'user',
    columns: ['id', 'person_id', 'login', 'pin', 'email', 'password', 'password_confirmation', 'administrator', 'active'],
    belongs_to: ['person'],
    has_many: ['tills']
  }
});