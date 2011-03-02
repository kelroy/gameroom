var Currency = new JS.Class({
  extend: {
    pretty: function(pennies) {
      value = pennies / 100;
      return '$' + Currency.format(value);
    },
    
    format: function(pennies) {
      return pennies.toFixed(2);
    }
  }
});