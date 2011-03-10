class TransactionsController < ApplicationController
  
  # GET /transactions
  # GET /transactions.xml
  # GET /transactions.json
  def index
    @transactions = Transaction.all
    
    respond_to do |format|
      format.json { render :json => @transactions.to_json(:include => [:items, :payments], :except => [:created_at, :updated_at]) }
      format.xml  { render :xml => @transactions.to_xml(:include => [:items, :payments], :except => [:created_at, :updated_at]) }
    end
  end
  
  # GET /transactions/1
  # GET /transactions/1.xml
  # GET /transactions/1.json
  def show
    @transaction = Transaction.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @transaction.to_json(:include => [:items, :payments], :except => [:created_at, :updated_at]) }
      format.xml  { render :xml => @transaction.to_xml(:include => [:items, :payments], :except => [:created_at, :updated_at]) }
    end
  end
  
  # POST /transactions
  # POST /transactions.xml
  # POST /transactions.json
  def create
    @transaction = Transaction.create(params[:transaction])

    respond_to do |format|
      if @transaction.save
        format.json  { render :json => @transaction.to_json(:include => [:items, :payments], :except => [:created_at, :updated_at]), :status => :created, :location => @transaction }
        format.xml  { render :xml => @transaction.to_xml(:include => [:items, :payments], :except => [:created_at, :updated_at]), :status => :created, :location => @transaction }
      else
        format.json  { render :json => @transaction.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @transaction.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /transactions/1
  # PUT /transactions/1.xml
  # PUT /transactions/1.json
  def update
    @transaction = Transaction.find(params[:id])

    respond_to do |format|
      if @transaction.update_attributes(params[:transaction])
        format.json  { head :ok }
        format.xml  { head :ok }
      else
        format.json  { render :json => @transaction.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @transaction.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /transactions/1
  # DELETE /transactions/1.json
  # DELETE /transactions/1.xml
  def destroy
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
end