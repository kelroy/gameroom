class ReceiptsController < ApplicationController
  before_filter :set_parent
  
  # Set the parent resource based on route param
  def set_parent
    @transaction ||= Transaction.find(params[:transaction_id])
  end
  
  # GET /transactions/1/receipt
  def show
    
    respond_to do |format|
      format.html # receipts/show.html.haml
    end
  end
end