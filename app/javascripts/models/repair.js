//= require "../model"

var Repair = new JS.Class(Model, {
  extend: {
    resource: 'repair',
    columns: ['id', 'name', 'phone', 'title', 'description', 'serial', 'symptoms', 'notes', 'warranty', 'cost', 'receiver', 'technician', 'started', 'finished', 'status', 'contacted', 'active']
  }
});