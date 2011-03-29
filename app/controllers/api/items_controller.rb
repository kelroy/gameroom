class Api::ItemsController < ApplicationController
  
  # GET /items.xml
  # GET /items.json
  def index
    @items = Item.all
    
    respond_to do |format|
      format.json { render :json => @items.to_json }
      format.xml  { render :xml => @items.to_xml }
    end
  end
  
  # GET /items/1.xml
  # GET /items/1.json
  def show
    @item = Item.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @item.to_json }
      format.xml  { render :xml => @item.to_xml }
    end
  end

  # GET|POST /items/search.xml
  # GET|POST /items/search.json
  def search
    @items = Item.search(params[:search]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @items.to_json }
      format.xml  { render :xml => @items.to_xml }
    end
  end
  
  # POST /items.xml
  # POST /items.json
  def create
    @item = Item.create(params[:item])

    respond_to do |format|
      if @item.save
        format.json  { render :json => @item.to_json, :status => :created }
        format.xml  { render :xml => @item.to_xml, :status => :created }
      else
        format.json  { render :json => @item.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @item.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /items/1.xml
  # PUT /items/1.json
  def update
    @item = Item.find(params[:id])

    respond_to do |format|
      if @item.update_attributes(params[:item])
        format.json  { head :ok }
        format.xml  { head :ok }
      else
        format.json  { render :json => @item.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @item.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /items/1.json
  # DELETE /items/1.xml
  def destroy
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
end