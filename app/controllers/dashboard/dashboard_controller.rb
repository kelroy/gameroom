class Dashboard::DashboardController < ApplicationController
  before_filter :authenticate
  layout 'dashboard'
  
  def index
    render
  end
end