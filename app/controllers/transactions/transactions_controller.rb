class Transactions::TransactionsController < ApplicationController
  before_filter :authenticate
  
  def index
    @tills = Till.where('active = ?', true)
  end
end