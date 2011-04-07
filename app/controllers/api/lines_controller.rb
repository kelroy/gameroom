class Api::LinesController < ApplicationController
  
  # GET /lines
  # GET /lines.xml
  # GET /lines.json
  # GET /[parent]/:parent_id/lines.xml
  # GET /[parent]/:parent_id/lines.json
  def index
    if params[:item_id]
      @lines = Line.find_all_by_item_id(params[:item_id])
    elsif params[:transaction_id]
      @lines = Line.find_all_by_transaction_id(params[:transaction_id])
    else
      @lines = Line.all
    end
    
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
  
  # GET|POST /lines/search.xml
  # GET|POST /lines/search.json
  def search
    @lines = Line.search(params[:search]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @lines.to_json }
      format.xml  { render :xml => @lines.to_xml }
    end
  end
  
  # GET|POST /lines/where.xml
  # GET|POST /lines/where.json
  def where
    @lines = Line.where(params[:statement], *params[:params]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @lines.to_json }
      format.xml  { render :xml => @lines.to_xml }
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
  
  # PUT /lines/1.xml
  # PUT /lines/1.json
  def update
    @line = Line.find(params[:id])

    respond_to do |format|
      if @line.update_attributes(params[:line])
        format.json  { render :json => @line.to_json, :status => :ok }
        format.xml  { render :xml => @line.to_xml, :status => :ok }
      else
        format.json  { render :json => @line.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @line.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /lines/1.xml
  # DELETE /lines/1.json
  def destroy
    @line = Line.find(params[:id])
    @line.destroy

    respond_to do |format|
      format.json  { render :json => @line.to_json, :status => :ok }
      format.xml  { render :xml => @line.to_xml, :status => :ok }
    end
  end
end