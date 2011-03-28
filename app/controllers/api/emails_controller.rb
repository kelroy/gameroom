class Api::EmailsController < ApplicationController
  
  # GET /emails
  # GET /emails.xml
  # GET /emails.json
  def index
    @emails = Email.all
    
    respond_to do |format|
      format.json { render :json => @emails.to_json(:except => [:created_at, :updated_at]) }
      format.xml  { render :xml => @emails.to_xml(:except => [:created_at, :updated_at]) }
    end
  end
  
  # GET /emails/1
  # GET /emails/1.xml
  # GET /emails/1.json
  def show
    @email = Email.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @email.to_json(:except => [:created_at, :updated_at]) }
      format.xml  { render :xml => @email.to_xml(:except => [:created_at, :updated_at]) }
    end
  end
  
  # POST /emails
  # POST /emails.xml
  # POST /emails.json
  def create
    @email = Email.create(params[:email])

    respond_to do |format|
      if @email.save
        format.json  { render :json => @email.to_json(:except => [:created_at, :updated_at]), :status => :created }
        format.xml  { render :xml => @email.to_xml(:except => [:created_at, :updated_at]), :status => :created }
      else
        format.json  { render :json => @email.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @email.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /emails/1
  # PUT /emails/1.xml
  # PUT /emails/1.json
  def update
    @email = Email.find(params[:id])

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
  
  # DELETE /emails/1
  # DELETE /emails/1.xml
  def destroy
    @email = Email.find(params[:id])
    @email.destroy

    respond_to do |format|
      format.json  { head :ok }
      format.xml  { head :ok }
    end
  end
end