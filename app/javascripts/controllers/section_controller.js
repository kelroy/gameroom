//= require "view_controller"

var SectionController = new JS.Class(ViewController, {
  
  initialize: function(view, sections) {
    this.callSuper();
    this.sections = sections;
    $('a', view).bind('click', {instance: this, view: this.view}, this.doClick);
  },
  
  doClick: function(event) {
    index = $('li > a', event.data.view).index(this);
    event.data.instance.showSection(index);
    event.preventDefault();
  },
  
  showSection: function(index) {
    this.hideSections();
    this.sections[index].show();
    $('li > a', this.view).removeClass('selected');
    $('li', this.view).eq(index).find('a').addClass('selected');
  },
  
  hideSections: function() {
    for(section in this.sections) {
      $(this.sections[section]).hide();
    }
  },
  
  reset: function() {
    this.view.show();
    this.showSection(0);
  }
});