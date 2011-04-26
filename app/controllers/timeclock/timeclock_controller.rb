class Timeclock::TimeclockController < ApplicationController
  before_filter :authenticate
  
  def index
    @users = User.all
  end
end