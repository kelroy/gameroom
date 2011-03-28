class Api::AddressesController < ApplicationController
  
  # GET /addresses
  # GET /addresses.xml
  # GET /addresses.json
  def index
    @addresses = Address.all
    
    respond_to do |format|
      format.json { render :json => @addresses.to_json(:except => [:created_at, :updated_at]) }
      format.xml  { render :xml => @addresses.to_xml(:except => [:created_at, :updated_at]) }
    end
  end
  
  # GET /addresses/1
  # GET /addresses/1.xml
  # GET /addresses/1.json
  def show
    @address = Address.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @address.to_json(:except => [:created_at, :updated_at]) }
      format.xml  { render :xml => @address.to_xml(:except => [:created_at, :updated_at]) }
    end
  end
  
  # POST /addresses
  # POST /addresses.xml
  # POST /addresses.json
  def create
    @address = Address.create(params[:address])

    respond_to do |format|
      if @address.save
        format.json  { render :json => @address.to_json(:except => [:created_at, :updated_at]), :status => :created }
        format.xml  { render :xml => @address.to_xml(:except => [:created_at, :updated_at]), :status => :created }
      else
        format.json  { render :json => @address.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @address.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /addresses/1
  # PUT /addresses/1.xml
  # PUT /addresses/1.json
  def update
    @address = Address.find(params[:id])

    respond_to do |format|
      if @address.update_attributes(params[:address])
        format.json  { head :ok }
        format.xml  { head :ok }
      else
        format.json  { render :json => @address.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @address.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /addresses/1
  # DELETE /addresses/1.xml
  def destroy
    @address = Address.find(params[:id])
    @address.destroy

    respond_to do |format|
      format.json  { head :ok }
      format.xml  { head :ok }
    end
  end
end