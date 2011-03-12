class Transactions::TransactionsController < ApplicationController
  before_filter :authenticate
  layout 'transactions'
  
  def index
    render
  end
end