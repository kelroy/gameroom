class Api::LinesController < ApplicationController
  before_filter :set_parent
  
  # Set the parent resource based on route param
  def set_parent
    @transaction ||= Transaction.find(params[:transaction_id])
  end
  
  # GET /transactions/:id/lines
  # GET /transactions/:id/lines.xml
  # GET /transactions/:id/lines.json
  def index
    @lines = @transaction.lines
    
    respond_to do |format|
      format.json { render :json => @lines }
      format.xml  { render :xml => @lines }
    end
  end
  
  # GET /transactions/:id/lines/1
  # GET /transactions/:id/lines/1.xml
  # GET /transactions/:id/lines/1.json
  def show
    @line = @transaction.lines.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @line }
      format.xml  { render :xml => @line }
    end
  end
  
  # POST /transactions/:id/lines
  # POST /transactions/:id/lines.xml
  # POST /transactions/:id/lines.json
  def create
    @line = @transaction.lines.create(params[:line].merge(:account_id => @account.id))

    respond_to do |format|
      if @line.save
        format.json  { render :json => @line, :status => :created }
        format.xml  { render :xml => @line, :status => :created }
      else
        format.json  { render :json => @line.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @line.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # PUT /transactions/:id/lines/1
  # PUT /transactions/:id/lines/1.json
  # PUT /transactions/:id/lines/1.xml
  def update
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
  
  # DELETE /transactions/:id/lines/1
  # DELETE /transactions/:id/lines/1.json
  # DELETE /transactions/:id/lines/1.xml
  def destroy
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
end