var PageController = new JS.Class(ViewController, {
  
  sections: [],
  
  initialize: function(view, sections) {
    $('a', view).bind('click', {page_controller: this, view: view}, this.doClick);
    this.sections = sections;
    this.callSuper();
  },
  
  doClick: function(event) {
    index = $('li > a', event.data.view).index(this);
    event.data.page_controller.showSection(index);
    event.preventDefault();
  },
  
  showSection: function(index) {
    this.hideSections();
    this.sections[index].show();
    $('li a', this.view).removeClass('selected');
    $('li a', this.view).eq(index).addClass('selected');
  },
  
  hideSections: function() {
    for(section in this.sections) {
      $(this.sections[section]).hide();
    }
  },
  
  reset: function() {
    $('li a', this.view).removeClass('selected');
    $('li a', this.view).first().addClass('selected');
	this.sections[0].show();
    this.view.show();
  }
});