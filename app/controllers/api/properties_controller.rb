class Api::PropertiesController < ApplicationController
  
  # GET /properties.xml
  # GET /properties.json
  # GET /items/:item_id/properties.xml
  # GET /items/:item_id/properties.json
  def index
    if params[:item_id]
      @properties = Property.all(:include => :items, :conditions => ["items.id = ?", params[:item_id]])
    else
      @properties = Property.all
    end
    
    respond_to do |format|
      format.json { render :json => @properties.to_json }
      format.xml  { render :xml => @properties.to_xml }
    end
  end
  
  # GET /properties/1.xml
  # GET /properties/1.json
  def show
    @property = Property.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @property.to_json }
      format.xml  { render :xml => @property.to_xml }
    end
  end
  
  # GET|POST /properties/search.xml
  # GET|POST /properties/search.json
  def search
    @properties = Property.search(params[:search]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @properties.to_json }
      format.xml  { render :xml => @properties.to_xml }
    end
  end
  
  # GET|POST /properties/where.xml
  # GET|POST /properties/where.json
  def where
    @properties = Property.where(params[:statement], *params[:params]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @properties.to_json }
      format.xml  { render :xml => @properties.to_xml }
    end
  end
  
  # POST /properties.xml
  # POST /properties.json
  def create
    @property = Property.create(params[:property])

    respond_to do |format|
      if @property.save
        format.json  { render :json => @property.to_json, :status => :created }
        format.xml  { render :xml => @property.to_xml, :status => :created }
      else
        format.html { render :action => "new" }
        format.json  { render :json => @property.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @property.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /properties/1.xml
  # PUT /properties/1.json
  def update
    @property = Property.find(params[:id])

    respond_to do |format|
      if @property.update_attributes(params[:property])
        format.json  { render :json => @property.to_json, :status => :ok }
        format.xml  { render :xml => @property.to_xml, :status => :ok }
      else
        format.json  { render :json => @property.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @property.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /properties/1.xml
  # DELETE /properties/1.json
  def destroy
    @property = Property.find(params[:id])
    @property.destroy

    respond_to do |format|
      format.json  { render :json => @property.to_json, :status => :ok }
      format.xml  { render :xml => @property.to_xml, :status => :ok }
    end
  end
end