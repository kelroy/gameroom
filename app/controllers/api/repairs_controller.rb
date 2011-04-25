class Api::RepairsController < ApplicationController

  # GET /repairs.xml
  # GET /repairs.json
  def index
    @repairs = Repair.all
    
    respond_to do |format|
      format.json { render :json => @repairs.to_json }
      format.xml  { render :xml => @repairs.to_xml }
    end
  end
  
  # GET /repairs/1.xml
  # GET /repairs/1.json
  def show
    @repair = Repair.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @repair.to_json }
      format.xml  { render :xml => @repair.to_xml }
    end
  end
  
  # GET|POST /repairs/search.xml
  # GET|POST /repairs/search.json
  def search
    @repairs = Repair.search(params[:search]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @repairs.to_json }
      format.xml  { render :xml => @repairs.to_xml }
    end
  end
  
  # GET|POST /repairs/where.xml
  # GET|POST /repairs/where.json
  def where
    @repairs = Repair.where(params[:statement], *params[:params]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @repairs.to_json }
      format.xml  { render :xml => @repairs.to_xml }
    end
  end
  
  # POST /repairs.xml
  # POST /repairs.json
  def create
    @repair = Repair.create(params[:repair])

    respond_to do |format|
      if @repair.save
        format.json  { render :json => @repair.to_json, :status => :created }
        format.xml  { render :xml => @repair.to_xml, :status => :created }
      else
        format.json  { render :json => @repair.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @repair.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # GET /repairs/1/receipt
  # GET /repairs/1/receipt.svg
  def receipt
    @repair = Repair.find(params[:id])
    
    respond_to do |format|
      format.html { render :layout => 'receipt' } # api/repairs/receipt.html.haml
      format.pdf                                  # api/repairs/receipt.pdf.prawn
    end
  end

  # PUT /repairs/1.xml
  # PUT /repairs/1.json
  def update
    @repair = Repair.find(params[:id])

    respond_to do |format|
      if @repair.update_attributes(params[:repair])
        format.json  { render :json => @repair.to_json, :status => :ok }
        format.xml  { render :xml => @repair.to_xml, :status => :ok }
      else
        format.json  { render :json => @repair.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @repair.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /repairs/1.xml
  # DELETE /repairs/1.json
  def destroy
    @repair = Repair.find(params[:id])
    @repair.destroy

    respond_to do |format|
      format.json  { render :json => @repair.to_json, :status => :ok }
      format.xml  { render :xml => @repair.to_xml, :status => :ok }
    end
  end
end
