class Api::EmailsController < ApplicationController
  before_filter :set_parent
  
  # Set the parent resource based on route param
  def set_parent
    @person ||= Person.find(params[:person_id])
  end
  
  # GET /persons/:id/emails
  # GET /persons/:id/emails.xml
  # GET /persons/:id/emails.json
  def index
    @emails = @person.emails
    
    respond_to do |format|
      format.json { render :json => @emails.to_json(:except => [:person_id, :created_at, :updated_at]) }
      format.xml  { render :xml => @emails.to_xml(:except => [:person_id, :created_at, :updated_at]) }
    end
  end
  
  # GET /persons/:id/emails/1
  # GET /persons/:id/emails/1.xml
  # GET /persons/:id/emails/1.json
  def show
    @email = @person.emails.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @email.to_json(:except => [:person_id, :created_at, :updated_at]) }
      format.xml  { render :xml => @email.to_xml(:except => [:person_id, :created_at, :updated_at]) }
    end
  end
  
  # POST /persons/:id/emails
  # POST /persons/:id/emails.xml
  # POST /persons/:id/emails.json
  def create
    @email = @person.emails.create(params[:email])

    respond_to do |format|
      if @email.save
        format.json  { render :json => @email.to_json(:except => [:person_id, :created_at, :updated_at]), :status => :created }
        format.xml  { render :xml => @email.to_xml(:except => [:person_id, :created_at, :updated_at]), :status => :created }
      else
        format.json  { render :json => @email.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @email.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /persons/:id/emails/1
  # PUT /persons/:id/emails/1.xml
  # PUT /persons/:id/emails/1.json
  def update
    @email = @person.emails.find(params[:id])

    respond_to do |format|
      if @email.update_attributes(params[:email])
        format.json  { head :ok }
        format.xml  { head :ok }
      else
        format.json  { render :json => @email.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @email.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /persons/:id/emails/1
  # DELETE /persons/:id/emails/1.xml
  def destroy
    @email = @person.emails.find(params[:id])
    @email.destroy

    respond_to do |format|
      format.json  { head :ok }
      format.xml  { head :ok }
    end
  end
end