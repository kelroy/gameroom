var String = new JS.Class({
  extend: {
    ucfirst: function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }
});