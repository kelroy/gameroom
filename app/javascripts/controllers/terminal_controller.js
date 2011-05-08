//= require "login/login_controller"
//= require "dashboard/dashboard_controller"
//= require "transactions/transactions_controller"
//= require "inventory/inventory_controller"
//= require "reports/reports_controller"
//= require "tills/tills_controller"
//= require "timeclock/timeclock_controller"
//= require "employees/employees_controller"

var TerminalController = new JS.Class({
  
  initialize: function() {
    this.login_controller = new LoginController('div#login');
    this.dashboard_controller = new DashboardController('div#dashboard');
    this.transactions_controller = new TransactionsController('div#transactions');
    this.inventory_controller = new InventoryController('div#inventory');
    this.reports_controller = new ReportsController('div#reports');
    this.tills_controller = new TillsController('div#tills');
    this.timeclock_controller = new TimeclockController('div#timeclock');
    this.employees_controller = new EmployeesController('div#employees');
    
    this.reset();
  },
  
  reset: function() {
    this.login_controller.view.hide();
    this.dashboard_controller.view.hide();
    this.transactions_controller.view.hide();
    this.inventory_controller.view.hide();
    this.reports_controller.view.hide();
    this.tills_controller.view.hide();
    this.timeclock_controller.view.hide();
    this.employees_controller.view.hide();
  }
});