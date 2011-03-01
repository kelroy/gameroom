var Currency = new JS.Class({
  extend: {
    pretty: function(pennies) {
      value = pennies / 100;
      return '$' + value.toFixed(2);
    }
  }
});