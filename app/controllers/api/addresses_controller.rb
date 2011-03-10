class Api::AddressesController < ApplicationController
  before_filter :set_parent
  
  # Set the parent resource based on route param
  def set_parent
    @person ||= Person.find(params[:person_id])
  end
  
  # GET /persons/:id/addresses
  # GET /persons/:id/addresses.xml
  # GET /persons/:id/addresses.json
  def index
    @addresses = @person.addresses
    
    respond_to do |format|
      format.json { render :json => @addresses.to_json(:except => [:person_id, :created_at, :updated_at]) }
      format.xml  { render :xml => @addresses.to_xml(:except => [:person_id, :created_at, :updated_at]) }
    end
  end
  
  # GET /persons/:id/addresses/1
  # GET /persons/:id/addresses/1.xml
  # GET /persons/:id/addresses/1.json
  def show
    @address = @person.addresses.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @address.to_json(:except => [:person_id, :created_at, :updated_at]) }
      format.xml  { render :xml => @address.to_xml(:except => [:person_id, :created_at, :updated_at]) }
    end
  end
  
  # POST /persons/:id/addresses
  # POST /persons/:id/addresses.xml
  # POST /persons/:id/addresses.json
  def create
    @address = @person.addresses.create(params[:address])

    respond_to do |format|
      if @address.save
        format.json  { render :json => @address.to_json(:except => [:person_id, :created_at, :updated_at]), :status => :created, :location => [ @person, @address ] }
        format.xml  { render :xml => @address.to_xml(:except => [:person_id, :created_at, :updated_at]), :status => :created, :location => [ @person, @address ] }
      else
        format.json  { render :json => @address.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @address.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /persons/:id/addresses/1
  # PUT /persons/:id/addresses/1.xml
  # PUT /persons/:id/addresses/1.json
  def update
    @address = @person.addresses.find(params[:id])

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
  
  # DELETE /persons/:id/addresses/1
  # DELETE /persons/:id/addresses/1.xml
  def destroy
    @address = @person.addresses.find(params[:id])
    @address.destroy

    respond_to do |format|
      format.json  { head :ok }
      format.xml  { head :ok }
    end
  end
end