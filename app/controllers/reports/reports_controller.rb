class Reports::ReportsController < ApplicationController
  before_filter :super_authenticate
  layout 'reports'
  
  def index
    render
  end
end