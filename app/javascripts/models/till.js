//= require "../model"
//= require "entry"

var Till = new JS.Class(Model, {
  extend: {
    resource: 'till',
    columns: ['id', 'title', 'description', 'minimum_transfer', 'minimum_balance', 'retainable', 'active'],
    has_many: ['entries', 'transactions', 'users']
  }
});