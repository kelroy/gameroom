class Users::UsersController < ApplicationController
  before_filter :super_authenticate
  
  def index
    @people = Person.all
  end
end