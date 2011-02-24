class TerminalController < ApplicationController
  before_filter :authenticate
  
  def index
    render
  end
end