//= require "../model"
//= require "item"

var Property = new JS.Class(Model, {
  extend: {
    resource: 'property',
    columns: ['id', 'key', 'value'],
  }
});