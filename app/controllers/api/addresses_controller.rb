class Api::AddressesController < ApplicationController
  
  # GET /addresses.xml
  # GET /addresses.json
  # GET /people/:person_id/addresses.xml
  # GET /people/:person_id/addresses.json
  def index
    if params[:person_id]
      @addresses = Address.find_all_by_person_id(params[:person_id])
    else
      @addresses = Address.all
    end
    
    respond_to do |format|
      format.json { render :json => @addresses.to_json }
      format.xml  { render :xml => @addresses.to_xml }
    end
  end
  
  # GET /addresses/1.xml
  # GET /addresses/1.json
  def show
    @address = Address.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @address.to_json }
      format.xml  { render :xml => @address.to_xml }
    end
  end
  
  # POST /addresses.xml
  # POST /addresses.json
  def create
    @address = Address.create(params[:address])

    respond_to do |format|
      if @address.save
        format.json  { render :json => @address.to_json, :status => :created }
        format.xml  { render :xml => @address.to_xml, :status => :created }
      else
        format.json  { render :json => @address.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @address.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /addresses/1.xml
  # PUT /addresses/1.json
  def update
    @address = Address.find(params[:id])

    respond_to do |format|
      if @address.update_attributes(params[:address])
        format.json  { render :json => @address.to_json, :status => :ok }
        format.xml  { render :xml => @address.to_xml, :status => :ok }
      else
        format.json  { render :json => @address.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @address.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /addresses/1.xml
  # DELETE /addresses/1.json
  def destroy
    @address = Address.find(params[:id])
    @address.destroy

    respond_to do |format|
      format.json  { head :ok }
      format.xml  { head :ok }
    end
  end
end