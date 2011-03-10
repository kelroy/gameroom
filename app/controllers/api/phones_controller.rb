class Api::PhonesController < ApplicationController
  before_filter :set_parent
  
  # Set the parent resource based on route param
  def set_parent
    @person ||= Person.find(params[:person_id])
  end
  
  # GET /persons/:id/phones
  # GET /persons/:id/phones.xml
  # GET /persons/:id/phones.json
  def index
    @phones = @person.phones
    
    respond_to do |format|
      format.json { render :json => @phones.to_json(:except => [:person_id, :created_at, :updated_at]) }
      format.xml  { render :xml => @phones.to_xml(:except => [:person_id, :created_at, :updated_at]) }
    end
  end
  
  # GET /persons/:id/phones/1
  # GET /persons/:id/phones/1.xml
  # GET /persons/:id/phones/1.json
  def show
    @phone = @person.phones.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @phone.to_json(:except => [:person_id, :created_at, :updated_at]) }
      format.xml  { render :xml => @phone.to_xml(:except => [:person_id, :created_at, :updated_at]) }
    end
  end
  
  # POST /persons/:id/phones
  # POST /persons/:id/phones.xml
  # POST /persons/:id/phones.json
  def create
    @phone = @person.phones.create(params[:phone])

    respond_to do |format|
      if @phone.save
        format.json  { render :json => @phone.to_json(:except => [:person_id, :created_at, :updated_at]), :status => :created, :location => [ @person, @phone ] }
        format.xml  { render :xml => @phone.to_xml(:except => [:person_id, :created_at, :updated_at]), :status => :created, :location => [ @person, @phone ] }
      else
        format.json  { render :json => @phone.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @phone.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /persons/:id/phones/1
  # PUT /persons/:id/phones/1.xml
  # PUT /persons/:id/phones/1.json
  def update
    @phone = @person.phones.find(params[:id])

    respond_to do |format|
      if @phone.update_attributes(params[:phone])
        format.json  { head :ok }
        format.xml  { head :ok }
      else
        format.json  { render :json => @phone.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @phone.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /persons/:id/phones/1
  # DELETE /persons/:id/phones/1.xml
  def destroy
    @phone = @person.phones.find(params[:id])
    @phone.destroy

    respond_to do |format|
      format.json  { head :ok }
      format.xml  { head :ok }
    end
  end
end