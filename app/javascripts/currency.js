var Currency = new JS.Class({
  extend: {
    pretty: function(pennies) {
      return '$' + Currency.format(pennies);
    },
    
    format: function(pennies) {
      value = pennies / 100;
      return value.toFixed(2);
    },
    
    toPennies: function(currency) {
      return parseInt(Math.round(currency * 100));
    }
  }
});