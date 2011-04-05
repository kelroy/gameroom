/* Gameroom */
//= require "factories/base"
//= require "controllers/transactions/terminal_controller"
//= require "controllers/timeclock/timeclock_controller"

var transactions = {
  
  run: function() {
    new TerminalController();
  }
  
};

var dashboard = {
  
  run: function() {

  }
  
};

var reports = {
  
  run: function() {
    
  }
  
};

var timeclock = {
  
  run: function() {
    new TimeclockController();
  }
  
};

var tills = {
  
  run: function() {

  }
  
};

var users = {
  
  run: function() {
    
  }
  
};