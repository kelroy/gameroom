class Api::TimecardsController < ApplicationController
  
  # GET /timecards.xml
  # GET /timecards.json
  # GET /employee/:employee_id/timecards.xml
  # GET /employee/:employee_id/timecards.json
  def index
    if params[:employee_id]
      @timecards = Timecard.find_all_by_employee_id(params[:employee_id])
    else
      @timecards = Timecard.all
    end
    
    respond_to do |format|
      format.json { render :json => @timecards.to_json(:except => [:created_at, :updated_at]) }
      format.xml  { render :xml => @timecards.to_xml(:except => [:created_at, :updated_at]) }
    end
  end
  
  # GET /timecards/1.xml
  # GET /timecards/1.json
  def show
    @timecard = Timecard.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @timecard.to_json(:except => [:created_at, :updated_at]) }
      format.xml  { render :xml => @timecard.to_xml(:except => [:created_at, :updated_at]) }
    end
  end
  
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
  
  # DELETE /timecards/1.xml
  # DELETE /timecards/1.json
  def destroy
    @timecard = Timecard.find(params[:id])
    @timecard.destroy

    respond_to do |format|
      format.json  { head :ok }
      format.xml  { head :ok }
    end
  end
end