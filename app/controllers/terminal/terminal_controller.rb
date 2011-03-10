class Terminal::TerminalController < ApplicationController
  before_filter :authenticate
  layout 'terminal'
  
  def index
    render
  end
end