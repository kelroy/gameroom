//= require "terminal_nav_controller"
//= require "../login/login_controller"
//= require "../dashboard/dashboard_controller"
//= require "../transactions/transactions_controller"
//= require "../inventory/inventory_controller"
//= require "../reports/reports_controller"
//= require "../tills/tills_controller"
//= require "../timeclock/timeclock_controller"
//= require "../users/users_controller"

var TerminalController = new JS.Class({
  
  initialize: function() {
    this.user = null;
    
    this.nav_controller = new TerminalNavController('ul#terminal_nav');
    this.login_controller = new LoginController('div#login');
    this.dashboard_controller = new DashboardController('div#dashboard');
    this.transactions_controller = new TransactionsSessionController();
    this.inventory_controller = new InventoryController('div#inventory');
    this.repairs_controller = new RepairsController('div#repairs');
    this.reports_controller = new ReportsController('div#reports');
    this.tills_controller = new TillsController('div#tills');
    this.timeclock_controller = new TimeclockController('div#timeclock');
    this.users_controller = new UsersController('div#users');
    
    this.nav_controller.addObserver(this.onNav, this);
    this.login_controller.addObserver(this.onLogin, this);
    this.dashboard_controller.addObserver(this.onDashboard, this);
    
    $('form', this.view).submit(function(event) {
      event.preventDefault();
    });
    
    this.reset();
  },
  
  reset: function() {
    this.dashboard_controller.deactivate();
    this.transactions_controller.deactivate();
    this.inventory_controller.deactivate();
    this.repairs_controller.deactivate();
    this.reports_controller.deactivate();
    this.tills_controller.deactivate();
    this.timeclock_controller.deactivate();
    this.users_controller.deactivate();
  },
  
  onNav: function(selection) {
    switch(selection) {
      case 'dashboard':
        this.reset();
        this.dashboard_controller.activate();
        break;
      case 'logout':
        this.reset();
        this.user = null;
        this.nav_controller.reset();
        this.login_controller.activate();
        break;
      default:
        break;
    }
  },
  
  onLogin: function(user) {
    this.user = user;
    this.nav_controller.update(user);
    this.login_controller.view.hide();
    this.dashboard_controller.activate();
  },
  
  onDashboard: function(application) {
    this.reset()
    switch(application) {
      case 'transactions':
        this.transactions_controller.activate(this.user);
        break;
      case 'timeclock':
        this.timeclock_controller.activate();
        break;
      case 'tills':
        this.tills_controller.activate();
        break;
      case 'inventory':
        this.inventory_controller.activate();
        break;
      case 'repairs':
        this.repairs_controller.activate();
        break;
      case 'reports':
        this.reports_controller.activate();
        break;
      case 'users':
        this.users_controller.activate();
        break;
      default:
        break;
    }
  }
});