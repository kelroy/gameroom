class Timeclock::TimeclockController < ApplicationController
  before_filter :authenticate
  
  def index
    render
  end
end