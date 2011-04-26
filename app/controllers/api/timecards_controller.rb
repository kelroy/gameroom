class Api::TimecardsController < ApplicationController
  
  # GET /timecards.xml
  # GET /timecards.json
  # GET /user/:user_id/timecards.xml
  # GET /user/:user_id/timecards.json
  def index
    if params[:user_id]
      @timecards = Timecard.find_all_by_user_id(params[:user_id])
    else
      @timecards = Timecard.all
    end
    
    respond_to do |format|
      format.json { render :json => @timecards.to_json }
      format.xml  { render :xml => @timecards.to_xml }
    end
  end
  
  # GET /timecards/1.xml
  # GET /timecards/1.json
  def show
    @timecard = Timecard.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @timecard.to_json }
      format.xml  { render :xml => @timecard.to_xml }
    end
  end
  
  # GET|POST /timecards/search.xml
  # GET|POST /timecards/search.json
  def search
    @timecards = Timecard.search(params[:search]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @timecards.to_json }
      format.xml  { render :xml => @timecards.to_xml }
    end
  end
  
  # GET|POST /timecards/where.xml
  # GET|POST /timecards/where.json
  def where
    @timecards = Timecard.where(params[:statement], *params[:params]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @timecards.to_json }
      format.xml  { render :xml => @timecards.to_xml }
    end
  end
  
  # POST /timecards.xml
  # POST /timecards.json
  def create
    @timecard = Timecard.create(params[:timecard])

    respond_to do |format|
      if @timecard.save
        format.json  { render :json => @timecard.to_json, :status => :created }
        format.xml  { render :xml => @timecard.to_xml, :status => :created }
      else
        format.json  { render :json => @timecard.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @timecard.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /timecards/1.xml
  # PUT /timecards/1.json
  def update
    @timecard = Timecard.find(params[:id])

    respond_to do |format|
      if @timecard.update_attributes(params[:timecard])
        format.json  { render :json => @timecard.to_json, :status => :ok }
        format.xml  { render :xml => @timecard.to_xml, :status => :ok }
      else
        format.json  { render :json => @timecard.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @timecard.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /timecards/1.xml
  # DELETE /timecards/1.json
  def destroy
    @timecard = Timecard.find(params[:id])
    @timecard.destroy

    respond_to do |format|
      format.json  { render :json => @timecard.to_json, :status => :ok }
      format.xml  { render :xml => @timecard.to_xml, :status => :ok }
    end
  end
end