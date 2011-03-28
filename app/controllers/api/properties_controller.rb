class Api::PropertiesController < ApplicationController
  
  # GET /properties
  # GET /properties.xml
  # GET /properties.json
  def index
    @properties = Property.all
    
    respond_to do |format|
      format.json { render :json => @properties.to_json(:except => [:created_at, :updated_at]) }
      format.xml  { render :xml => @properties.to_xml(:except => [:created_at, :updated_at]) }
    end
  end
  
  # GET /properties/1
  # GET /properties/1.xml
  # GET /properties/1.json
  def show
    @property = Property.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @property.to_json(:except => [:created_at, :updated_at]) }
      format.xml  { render :xml => @property.to_xml(:except => [:created_at, :updated_at]) }
    end
  end
  
  # POST /properties
  # POST /properties.xml
  # POST /properties.json
  def create
    @property = Property.create(params[:property])

    respond_to do |format|
      if @property.save
        format.json  { render :json => @property.to_json(:except => [:created_at, :updated_at]), :status => :created }
        format.xml  { render :xml => @property.to_xml(:except => [:created_at, :updated_at]), :status => :created }
      else
        format.html { render :action => "new" }
        format.json  { render :json => @property.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @property.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /properties/1
  # PUT /properties/1.xml
  # PUT /properties/1.json
  def update
    @property = Property.find(params[:id])

    respond_to do |format|
      if @property.update_attributes(params[:property])
        format.json  { head :ok }
        format.xml  { head :ok }
      else
        format.json  { render :json => @property.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @property.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /properties/1
  # DELETE /properties/1.xml
  def destroy
    @property = Property.find(params[:id])
    @property.destroy

    respond_to do |format|
      format.json  { head :ok }
      format.xml  { head :ok }
    end
  end
end