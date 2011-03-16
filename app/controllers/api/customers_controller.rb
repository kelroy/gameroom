class Api::CustomersController < ApplicationController
  
  # GET /customers
  # GET /customers.xml
  # GET /customers.json
  def index
    @customers = Customer.all
    
    respond_to do |format|
      format.json { render :json => @customers.to_json(:include => { :person => {:include => [:emails, :addresses, :phones]}}, :except => [:created_at, :updated_at]) }
      format.xml  { render :xml => @customers.to_xml(:include => { :person => {:include => [:emails, :addresses, :phones]}}, :except => [:created_at, :updated_at]) }
    end
  end
  
  # GET /customers/1
  # GET /customers/1.xml
  # GET /customers/1.json
  def show
    @customer = Customer.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @customer.to_json(:include => { :person => {:include => [:emails, :addresses, :phones]}}, :except => [:created_at, :updated_at]) }
      format.xml  { render :xml => @customer.to_xml(:include => { :person => {:include => [:emails, :addresses, :phones]}}, :except => [:created_at, :updated_at]) }
    end
  end
  
  # GET|POST /customers/search
  # GET|POST /customers/search.xml
  # GET|POST /customers/search.json
  def search
    @customers = Customer.search(params[:search]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @customers.to_json(:include => { :person => {:include => [:emails, :addresses, :phones]}}, :except => [:created_at, :updated_at]) }
      format.xml  { render :xml => @customers.to_xml(:include => { :person => {:include => [:emails, :addresses, :phones]}}, :except => [:created_at, :updated_at]) }
    end
  end
  
  # POST /customers
  # POST /customers.xml
  # POST /customers.json
  def create
    @customer = Customer.create(params[:customer])

    respond_to do |format|
      if @customer.save
        format.json  { render :json => @customer.to_json(:include => { :person => {:include => [:emails, :addresses, :phones]}}, :except => [:created_at, :updated_at]), :status => :created }
        format.xml  { render :xml => @customer.to_xml(:include => { :person => {:include => [:emails, :addresses, :phones]}}, :except => [:created_at, :updated_at]), :status => :created }
      else
        format.json  { render :json => @customer.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @customer.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /customers/1
  # PUT /customers/1.xml
  # PUT /customers/1.json
  def update
    @customer = Customer.find(params[:id])

    respond_to do |format|
      if @customer.update_attributes(params[:customer])
        format.json  { render :json => @customer.to_json(:include => { :person => {:include => [:emails, :addresses, :phones]}}, :except => [:created_at, :updated_at]), :status => :ok }
        format.xml  { head :ok }
      else
        format.json  { render :json => @customer.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @customer.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /customers/1
  # DELETE /customers/1.json
  # DELETE /customers/1.xml
  def destroy
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
end