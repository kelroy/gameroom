class Api::PeopleController < ApplicationController

  # GET /people
  # GET /people.xml
  # GET /people.json
  def index
    @people = Person.all
    
    respond_to do |format|
      format.json { render :json => @people.to_json(:include => [:emails, :addresses, :phones], :except => [:created_at, :updated_at, :account_id]) }
      format.xml  { render :xml => @people.to_xml(:include => [:emails, :addresses, :phones], :except => [:created_at, :updated_at, :account_id]) }
    end
  end
  
  # GET /people/1
  # GET /people/1.xml
  # GET /people/1.json
  def show
    @person = Person.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @person.to_json(:include => [:emails, :addresses, :phones], :except => [:created_at, :updated_at, :account_id]) }
      format.xml  { render :xml => @person.to_xml(:include => [:emails, :addresses, :phones], :except => [:created_at, :updated_at, :account_id]) }
    end
  end
  
  # POST /people
  # POST /people.xml
  # POST /people.json
  def create
    @person = Person.create(params[:person])

    respond_to do |format|
      if @person.save
        format.json  { render :json => @person.to_json(:include => [:emails, :addresses, :phones], :except => [:created_at, :updated_at, :account_id]), :status => :created, :location => @person }
        format.xml  { render :xml => @person.to_xml(:include => [:emails, :addresses, :phones], :except => [:created_at, :updated_at, :account_id]), :status => :created, :location => @person }
      else
        format.json  { render :json => @person.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @person.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /persons/1
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
  
  # DELETE /persons/1
  # DELETE /persons/1.json
  # DELETE /persons/1.xml
  def destroy
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
end
