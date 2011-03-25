class Transactions::TransactionsController < ApplicationController
  before_filter :authenticate
  
  def index
    render
  end
end