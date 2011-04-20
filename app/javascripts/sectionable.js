var Sectionable = new JS.Module({
  
  show: function() {
    if(this.view != null && this.view != undefined) {
      this.view.show();
    }
  },
  
  hide: function() {
    if(this.view != null && this.view != undefined) {
      this.view.hide();
    }
  }
});