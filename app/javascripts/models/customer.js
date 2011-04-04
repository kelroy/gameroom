//= require "../model"
//= require "person"

var Customer = new JS.Class(Model, {
  extend: {
    resource: 'customer',
    columns: ['id', 'person_id', 'credit', 'drivers_license_number', 'drivers_license_state', 'notes', 'active'],
    belongs_to: ['person'],
    has_many: ['transactions']
  }
});