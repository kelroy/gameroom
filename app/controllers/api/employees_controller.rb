class Api::EmployeesController < ApplicationController
  
  # GET /employees
  # GET /employees.json
  # GET /employees.xml
  def index
    @employees = Employee.all
    
    respond_to do |format|
      format.json { render :json => @employees.to_json}
      format.xml  { render :xml => @employees.to_xml }
    end
  end
  
  # GET /employees/1
  # GET /employees/1.json
  # GET /employees/1.xml
  def show
    @employee = Employee.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @employee.to_json }
      format.xml  { render :xml => @employee.to_xml }
    end
  end
  
  # POST /employees
  # POST /employees.json
  # POST /employees.xml
  def create
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
  
  # PUT /employees/1
  # PUT /employees/1.json
  # PUT /employees/1.xml
  def update
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
  
  # DELETE /employees/1
  # DELETE /employees/1.json
  # DELETE /employees/1.xml
  def destroy
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
end