class Api::EntriesController < ApplicationController
  
  # GET /entries
  # GET /entries.xml
  # GET /entries.json
  def index
    @entries = Entry.all
    
    respond_to do |format|
      format.json { render :json => @entries.to_json(:except => [:created_at, :updated_at]) }
      format.xml  { render :xml => @entries.to_xml(:except => [:created_at, :updated_at]) }
    end
  end
  
  # GET /entries/1
  # GET /entries/1.xml
  # GET /entries/1.json
  def show
    @entry = Entry.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @entry.to_json(:except => [:created_at, :updated_at]) }
      format.xml  { render :xml => @entry.to_xml(:except => [:created_at, :updated_at]) }
    end
  end
  
  # POST /entries
  # POST /entries.xml
  # POST /entries.json
  def create
    @entry = Entry.create(params[:entry])

    respond_to do |format|
      if @entry.save
        format.json  { render :json => @entry.to_json(:except => [:created_at, :updated_at]), :status => :created }
        format.xml  { render :xml => @entry.to_xml(:except => [:created_at, :updated_at]), :status => :created }
      else
        format.json  { render :json => @entry.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @entry.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /entries/1
  # PUT /entries/1.xml
  # PUT /entries/1.json
  def update
    @entry = Entry.find(params[:id])

    respond_to do |format|
      if @entry.update_attributes(params[:entry])
        format.json  { head :ok }
        format.xml  { head :ok }
      else
        format.json  { render :json => @entry.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @entry.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /entries/1
  # DELETE /entries/1.xml
  def destroy
    @entry = Entry.find(params[:id])
    @entry.destroy

    respond_to do |format|
      format.json  { head :ok }
      format.xml  { head :ok }
    end
  end
end