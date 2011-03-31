class Api::TillsController < ApplicationController
  
  # GET /tills.xml
  # GET /tills.json
  def index
    @tills = Till.all
    
    respond_to do |format|
      format.json { render :json => @tills.to_json }
      format.xml  { render :xml => @tills.to_xml }
    end
  end
  
  # GET /tills/1.xml
  # GET /tills/1.json
  def show
    @till = Till.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @till.to_json }
      format.xml  { render :xml => @till.to_xml }
    end
  end
  
  # POST /tills.xml
  # POST /tills.json
  def create
    @till = Till.create(params[:till])

    respond_to do |format|
      if @till.save
        format.json  { render :json => @till.to_json, :status => :created }
        format.xml  { render :xml => @till.to_xml, :status => :created }
      else
        format.json  { render :json => @till.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @till.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /tills/1.xml
  # PUT /tills/1.json
  def update
    @till = Till.find(params[:id])

    respond_to do |format|
      if @till.update_attributes(params[:till])
        format.json  { render :json => @till.to_json, :status => :ok }
        format.xml  { render :xml => @till.to_xml, :status => :ok }
      else
        format.json  { render :json => @till.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @till.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /tills/1.json
  # DELETE /tills/1.xml
  def destroy
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
end