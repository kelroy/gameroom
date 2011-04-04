//= require "../model"

var Entry = new JS.Class(Model, {
  extend: {
    resource: 'entry',
    columns: ['id', 'till_id', 'title', 'description', 'time', 'amount'],
    belongs_to: ['till']
  }
});