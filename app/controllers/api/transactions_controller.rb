class Api::TransactionsController < ApplicationController

  # GET /transactions.xml
  # GET /transactions.json
  # GET /[parent]/:parent_id/transactions.xml
  # GET /[parent]/:parent_id/transactions.json
  def index
    if params[:customer_id]
      @transactions = Transaction.find_all_by_customer_id(params[:customer_id])
    elsif params[:till_id]
      @transactions = Transaction.find_all_by_till_id(params[:till_id])
    else
      @transactions = Transaction.all
    end
    
    respond_to do |format|
      format.json { render :json => @transactions.to_json }
      format.xml  { render :xml => @transactions.to_xml }
    end
  end
  
  # GET /transactions/1.xml
  # GET /transactions/1.json
  def show
    @transaction = Transaction.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @transaction.to_json }
      format.xml  { render :xml => @transaction.to_xml }
    end
  end
  
  # GET /transactions/1/receipt
  # GET /transactions/1/receipt.svg
  def receipt
    @transaction = Transaction.find(params[:id])
    
    respond_to do |format|
      format.html { render :layout => 'receipt' } # api/transactions/receipt.html.haml
      format.pdf                                  # api/transactions/receipt.pdf.prawn
    end
  end
  
  # POST /transactions.xml
  # POST /transactions.json
  def create
    @transaction = Transaction.create(params[:transaction])

    respond_to do |format|
      if @transaction.save
        format.json  { render :json => @transaction.to_json, :status => :created }
        format.xml  { render :xml => @transaction.to_xml, :status => :created }
      else
        format.json  { render :json => @transaction.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @transaction.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /transactions/1.xml
  # PUT /transactions/1.json
  def update
    @transaction = Transaction.find(params[:id])

    respond_to do |format|
      if @transaction.update_attributes(params[:transaction])
        format.json  { render :json => @transaction.to_json, :status => :ok }
        format.xml  { render :xml => @transaction.to_xml, :status => :ok }
      else
        format.json  { render :json => @transaction.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @transaction.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /transactions/1.json
  # DELETE /transactions/1.xml
  def destroy
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
end