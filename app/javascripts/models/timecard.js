//= require "../model"
//= require "user"

var Timecard = new JS.Class(Model, {
  extend: {
    resource: 'timecard',
    columns: ['id', 'user_id', 'begin', 'end'],
    belongs_to: ['user']
  }
});