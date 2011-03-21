class Users::UsersController < ApplicationController
  before_filter :super_authenticate
  layout 'users'
  
  def index
    render
  end
end