class Api::PhonesController < ApplicationController
  
  # GET /phones
  # GET /phones.xml
  # GET /phones.json
  def index
    @phones = Phone.all
    
    respond_to do |format|
      format.json { render :json => @phones.to_json(:except => [:created_at, :updated_at]) }
      format.xml  { render :xml => @phones.to_xml(:except => [:created_at, :updated_at]) }
    end
  end
  
  # GET /phones/1
  # GET /phones/1.xml
  # GET /phones/1.json
  def show
    @phone = Phone.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @phone.to_json(:except => [:created_at, :updated_at]) }
      format.xml  { render :xml => @phone.to_xml(:except => [:created_at, :updated_at]) }
    end
  end
  
  # POST /phones
  # POST /phones.xml
  # POST /phones.json
  def create
    @phone = Phone.create(params[:phone])

    respond_to do |format|
      if @phone.save
        format.json  { render :json => @phone.to_json(:except => [:created_at, :updated_at]), :status => :created }
        format.xml  { render :xml => @phone.to_xml(:except => [:created_at, :updated_at]), :status => :created }
      else
        format.json  { render :json => @phone.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @phone.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /phones/1
  # PUT /phones/1.xml
  # PUT /phones/1.json
  def update
    @phone = Phone.find(params[:id])

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
  
  # DELETE /phones/1
  # DELETE /phones/1.xml
  def destroy
    @phone = Phone.find(params[:id])
    @phone.destroy

    respond_to do |format|
      format.json  { head :ok }
      format.xml  { head :ok }
    end
  end
end