class Users::UsersController < ApplicationController
  before_filter :super_authenticate
  
  def index
    @users = User.all
  end
end