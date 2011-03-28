class Api::TimecardsController < ApplicationController
  
  # GET /timecards
  # GET /timecards.xml
  # GET /timecards.json
  def index
    @timecards = Timecard.all
    
    respond_to do |format|
      format.json { render :json => @timecards.to_json(:except => [:created_at, :updated_at]) }
      format.xml  { render :xml => @timecards.to_xml(:except => [:created_at, :updated_at]) }
    end
  end
  
  # GET /timecards/1
  # GET /timecards/1.xml
  # GET /timecards/1.json
  def show
    @timecard = Timecard.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @timecard.to_json(:except => [:created_at, :updated_at]) }
      format.xml  { render :xml => @timecard.to_xml(:except => [:created_at, :updated_at]) }
    end
  end
  
  # POST /timecards
  # POST /timecards.xml
  # POST /timecards.json
  def create
    @timecard = Timecard.create(params[:timecard])

    respond_to do |format|
      if @timecard.save
        format.json  { render :json => @timecard.to_json(:except => [:created_at, :updated_at]), :status => :created }
        format.xml  { render :xml => @timecard.to_xml(:except => [:created_at, :updated_at]), :status => :created }
      else
        format.json  { render :json => @timecard.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @timecard.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /timecards/1
  # PUT /timecards/1.xml
  # PUT /timecards/1.json
  def update
    @timecard = Timecard.find(params[:id])

    respond_to do |format|
      if @timecard.update_attributes(params[:timecard])
        format.json  { head :ok }
        format.xml  { head :ok }
      else
        format.json  { render :json => @timecard.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @timecard.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /timecards/1
  # DELETE /timecards/1.xml
  def destroy
    @timecard = Timecard.find(params[:id])
    @timecard.destroy

    respond_to do |format|
      format.json  { head :ok }
      format.xml  { head :ok }
    end
  end
end