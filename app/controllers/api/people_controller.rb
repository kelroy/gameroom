class Api::PeopleController < ApplicationController

  # GET /people.xml
  # GET /people.json
  def index
    @people = Person.all
    
    respond_to do |format|
      format.json { render :json => @people.to_json }
      format.xml  { render :xml => @people.to_xml }
    end
  end
  
  # GET /people/1.xml
  # GET /people/1.json
  # GET /[parent]/:parent_id/person/1.xml
  # GET /[parent]/:parent_id/person/1.json
  def show
    if params[:customer_id]
      @person = Person.find_by_customer_id(params[:customer_id])
    elsif params[:employee_id]
      @person = Person.find_by_employee_id(params[:employee_id])
    elsif params[:user_id]
      @person = Person.find_by_user_id(params[:user_id])
    else
      @person = Person.find(params[:id])
    end
    
    respond_to do |format|
      format.json { render :json => @person.to_json }
      format.xml  { render :xml => @person.to_xml }
    end
  end
  
  # POST /people.xml
  # POST /people.json
  def create
    @person = Person.create(params[:person])

    respond_to do |format|
      if @person.save
        format.json  { render :json => @person.to_json, :status => :created }
        format.xml  { render :xml => @person.to_xml, :status => :created }
      else
        format.json  { render :json => @person.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @person.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /persons/1.xml
  # PUT /persons/1.json
  def update
    @person = Person.find(params[:id])

    respond_to do |format|
      if @person.update_attributes(params[:person])
        format.json  { head :ok }
        format.xml  { head :ok }
      else
        format.json  { render :json => @person.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @person.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /persons/1.json
  # DELETE /persons/1.xml
  def destroy
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
end
