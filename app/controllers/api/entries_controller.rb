class Api::EntriesController < ApplicationController
  
  # GET /entries.xml
  # GET /entries.json
  # GET /tills/:till_id/entries.xml
  # GET /tills/:till_id/entries.json
  def index
    if params[:till_id]
      @entries = Entry.find_all_by_till_id(params[:till_id])
    else
      @entries = Entry.all
    end
    
    respond_to do |format|
      format.json { render :json => @entries.to_json }
      format.xml  { render :xml => @entries.to_xml }
    end
  end
  
  # GET /entries/1.xml
  # GET /entries/1.json
  def show
    @entry = Entry.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @entry.to_json }
      format.xml  { render :xml => @entry.to_xml }
    end
  end
  
  # GET|POST /entries/search.xml
  # GET|POST /entries/search.json
  def search
    @entries = Entry.search(params[:search]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @entries.to_json }
      format.xml  { render :xml => @entries.to_xml }
    end
  end
  
  # GET|POST /entries/where.xml
  # GET|POST /entries/where.json
  def where
    @entries = Entry.where(params[:statement], *params[:params]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @entries.to_json }
      format.xml  { render :xml => @entries.to_xml }
    end
  end
  
  # POST /entries.xml
  # POST /entries.json
  def create
    @entry = Entry.create(params[:entry])

    respond_to do |format|
      if @entry.save
        format.json  { render :json => @entry.to_json, :status => :created }
        format.xml  { render :xml => @entry.to_xml, :status => :created }
      else
        format.json  { render :json => @entry.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @entry.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /entries/1.xml
  # PUT /entries/1.json
  def update
    @entry = Entry.find(params[:id])

    respond_to do |format|
      if @entry.update_attributes(params[:entry])
        format.json  { render :json => @entry.to_json, :status => :ok }
        format.xml  { render :xml => @entry.to_xml, :status => :ok }
      else
        format.json  { render :json => @entry.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @entry.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /entries/1.xml
  # DELETE /entries/1.json
  def destroy
    @entry = Entry.find(params[:id])
    @entry.destroy

    respond_to do |format|
      format.json  { render :json => @entry.to_json, :status => :ok }
      format.xml  { render :xml => @entry.to_xml, :status => :ok }
    end
  end
end