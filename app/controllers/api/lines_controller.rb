class Api::LinesController < ApplicationController
  
  # GET /lines
  # GET /lines.xml
  # GET /lines.json
  def index
    @lines = Line.all
    
    respond_to do |format|
      format.json { render :json => @lines }
      format.xml  { render :xml => @lines }
    end
  end
  
  # GET /lines/1
  # GET /lines/1.xml
  # GET /lines/1.json
  def show
    @line = Line.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @line }
      format.xml  { render :xml => @line }
    end
  end
  
  # POST /lines
  # POST /lines.xml
  # POST /lines.json
  def create
    @line = Line.create(params[:line])

    respond_to do |format|
      if @line.save
        format.json  { render :json => @line, :status => :created }
        format.xml  { render :xml => @line, :status => :created }
      else
        format.json  { render :json => @line.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @line.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # PUT /lines/1
  # PUT /lines/1.json
  # PUT /lines/1.xml
  def update
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
  
  # DELETE /lines/1
  # DELETE /lines/1.json
  # DELETE /lines/1.xml
  def destroy
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
end