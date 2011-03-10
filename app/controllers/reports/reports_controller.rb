class Reports::ReportsController < ApplicationController
  before_filter :authenticate
  layout 'reports'
  
  def index
    render
  end
end