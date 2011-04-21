class Support::SupportController < ApplicationController
  before_filter :authenticate
  
  def index
    render
  end
end