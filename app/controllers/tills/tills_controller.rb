class Tills::TillsController < ApplicationController
  before_filter :authenticate
  
  def index
    render
  end
end