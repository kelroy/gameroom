class ItemsController < ApplicationController
  before_filter :set_parent
  
  # Set the parent resource based on route param
  def set_parent
    @transaction ||= Transaction.find(params[:transaction_id])
  end
  
  # GET /transactions/:id/items
  # GET /transactions/:id/items.xml
  # GET /transactions/:id/items.json
  def index
    @items = @transaction.items
    
    respond_to do |format|
      format.json { render :json => @items }
      format.xml  { render :xml => @items }
    end
  end
  
  # GET /transactions/:id/items/1
  # GET /transactions/:id/items/1.xml
  # GET /transactions/:id/items/1.json
  def show
    @item = @transaction.items.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @item }
      format.xml  { render :xml => @item }
    end
  end
  
  # POST /transactions/:id/items
  # POST /transactions/:id/items.xml
  # POST /transactions/:id/items.json
  def create
    @item = @transaction.items.create(params[:item].merge(:account_id => @account.id))

    respond_to do |format|
      if @item.save
        format.json  { render :json => @item, :status => :created, :location => [ @transaction, @item ] }
        format.xml  { render :xml => @item, :status => :created, :location => [ @transaction, @item ] }
      else
        format.json  { render :json => @item.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @item.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # PUT /transactions/:id/items/1
  # PUT /transactions/:id/items/1.json
  # PUT /transactions/:id/items/1.xml
  def update
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
  
  # DELETE /transactions/:id/items/1
  # DELETE /transactions/:id/items/1.json
  # DELETE /transactions/:id/items/1.xml
  def destroy
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
end