//= require "../model"
//= require "employee"

var Timecard = new JS.Class(Model, {
  extend: {
    resource: 'timecard',
    columns: ['id', 'employee_id', 'begin', 'end'],
    belongs_to: ['employee']
  }
});