class Api::PropertiesController < ApplicationController
  before_filter :set_parent
  
  # Set the parent resource based on route param
  def set_parent
    @good ||= Good.find(params[:good_id])
  end
  
  # GET /goods/:id/properties
  # GET /goods/:id/properties.xml
  # GET /goods/:id/properties.json
  def index
    @properties = @good.properties
    
    respond_to do |format|
      format.json { render :json => @properties.to_json(:except => [:good_id, :created_at, :updated_at]) }
      format.xml  { render :xml => @properties.to_xml(:except => [:good_id, :created_at, :updated_at]) }
    end
  end
  
  # GET /goods/:id/properties/1
  # GET /goods/:id/properties/1.xml
  # GET /goods/:id/properties/1.json
  def show
    @property = @good.properties.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @property.to_json(:except => [:good_id, :created_at, :updated_at]) }
      format.xml  { render :xml => @property.to_xml(:except => [:good_id, :created_at, :updated_at]) }
    end
  end
  
  # POST /goods/:id/properties
  # POST /goods/:id/properties.xml
  # POST /goods/:id/properties.json
  def create
    @property = @good.properties.create(params[:property])

    respond_to do |format|
      if @property.save
        format.json  { render :json => @property.to_json(:except => [:good_id, :created_at, :updated_at]), :status => :created, :location => [ @good, @property ] }
        format.xml  { render :xml => @property.to_xml(:except => [:good_id, :created_at, :updated_at]), :status => :created, :location => [ @good, @property ] }
      else
        format.html { render :action => "new" }
        format.json  { render :json => @property.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @property.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /goods/:id/properties/1
  # PUT /goods/:id/properties/1.xml
  # PUT /goods/:id/properties/1.json
  def update
    @property = @good.properties.find(params[:id])

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
  
  # DELETE /goods/:id/properties/1
  # DELETE /goods/:id/properties/1.xml
  def destroy
    @property = @good.properties.find(params[:id])
    @property.destroy

    respond_to do |format|
      format.json  { head :ok }
      format.xml  { head :ok }
    end
  end
end