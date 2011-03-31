class Api::EmailsController < ApplicationController
  
  # GET /emails.xml
  # GET /emails.json
  # GET /people/:person_id/emails.xml
  # GET /people/:person_id/emails.json
  def index
    if params[:person_id]
      @emails = Email.find_all_by_person_id(params[:person_id])
    else
      @emails = Email.all
    end
    
    respond_to do |format|
      format.json { render :json => @emails.to_json }
      format.xml  { render :xml => @emails.to_xml }
    end
  end
  
  # GET /emails/1.xml
  # GET /emails/1.json
  def show
    @email = Email.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @email.to_json }
      format.xml  { render :xml => @email.to_xml }
    end
  end
  
  # POST /emails.xml
  # POST /emails.json
  def create
    @email = Email.create(params[:email])

    respond_to do |format|
      if @email.save
        format.json  { render :json => @email.to_json, :status => :created }
        format.xml  { render :xml => @email.to_xml, :status => :created }
      else
        format.json  { render :json => @email.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @email.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /emails/1.xml
  # PUT /emails/1.json
  def update
    @email = Email.find(params[:id])

    respond_to do |format|
      if @email.update_attributes(params[:email])
        format.json  { render :json => @email.to_json, :status => :ok }
        format.xml  { render :xml => @email.to_xml, :status => :ok }
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