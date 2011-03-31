class Api::CustomersController < ApplicationController
  
  # GET /customers.xml
  # GET /customers.json
  def index
    @customers = Customer.all
    
    respond_to do |format|
      format.json { render :json => @customers.to_json }
      format.xml  { render :xml => @customers.to_xml }
    end
  end
  
  # GET /customers/1.xml
  # GET /customers/1.json
  # GET /people/:person_id/customer.xml
  # GET /people/:person_id/customer.json
  def show
    if params[:person_id]
      @customer = Customer.find_by_person_id(params[:person_id])
    else
      @customer = Customer.find(params[:id])
    end
    
    respond_to do |format|
      format.json { render :json => @customer.to_json }
      format.xml  { render :xml => @customer.to_xml }
    end
  end
  
  # GET|POST /customers/search.xml
  # GET|POST /customers/search.json
  def search
    @customers = Customer.search(params[:search]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @customers.to_json }
      format.xml  { render :xml => @customers.to_xml }
    end
  end
  
  # POST /customers.xml
  # POST /customers.json
  def create
    @customer = Customer.create(params[:customer])

    respond_to do |format|
      if @customer.save
        format.json  { render :json => @customer.to_json, :status => :created }
        format.xml  { render :xml => @customer.to_xml, :status => :created }
      else
        format.json  { render :json => @customer.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @customer.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /customers/1.xml
  # PUT /customers/1.json
  def update
    @customer = Customer.find(params[:id])

    respond_to do |format|
      if @customer.update_attributes(params[:customer])
        format.json  { render :json => @customer.to_json, :status => :ok }
        format.xml  { render :xml => @customer.to_xml, :status => :ok }
      else
        format.json  { render :json => @customer.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @customer.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /customers/1.json
  # DELETE /customers/1.xml
  def destroy
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
end