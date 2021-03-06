/* Gameroom */
//= require "factories/base"
//= require "controllers/transactions/terminal_controller"
//= require "controllers/timeclock/timeclock_controller"
//= require "controllers/users/users_controller"

var transactions = {
  
  run: function() {
    new TerminalController();
  }
  
};

var dashboard = {
  
  run: function() {

  }
  
};

var inventory = {
  
  run: function() {
    new InventoryController();
  }
  
};

var repairs = {
  
  run: function() {
    new RepairsController();
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
    new TillsController();
  }
  
};

var users = {
  
  run: function() {
    new UsersController();
  }
  
};