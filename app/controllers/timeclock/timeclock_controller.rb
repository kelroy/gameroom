class Timeclock::TimeclockController < ApplicationController
  before_filter :authenticate
  
  def index
    @employees = Employee.all
  end
end