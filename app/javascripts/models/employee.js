//= require "../model"

var Employee = new JS.Class(Model, {
  extend: {
    resource: 'employee',
    columns: ['id', 'person_id', 'title', 'rate', 'active'],
    belongs_to: ['person'],
    has_many: ['timecards']
  }
});