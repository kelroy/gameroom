class Api::EmployeesController < ApiController
  
  # GET /employees.json
  # GET /employees.xml
  def index
    @employees = Employee.all
    
    respond_to do |format|
      format.json { render :json => @employees.to_json(:except => [:password_hash, :password_salt, :perishable_token, :persistence_token]) }
      format.xml  { render :xml => @employees.to_xml(:except => [:password_hash, :password_salt, :perishable_token, :persistence_token]) }
    end
  end
  
  # GET /employees/1.json
  # GET /employees/1.xml
  # GET /people/:person_id/employees.xml
  # GET /people/:person_id/employees.json
  def show
    if params[:person_id]
      @employee = Employee.find_by_person_id(params[:person_id])
    else
      @employee = Employee.find(params[:id])
    end
    
    respond_to do |format|
      format.json { render :json => @employee.to_json(:except => [:password_hash, :password_salt, :perishable_token, :persistence_token]) }
      format.xml  { render :xml => @employee.to_xml(:except => [:password_hash, :password_salt, :perishable_token, :persistence_token]) }
    end
  end
  
  # GET|POST /employees/search.xml
  # GET|POST /employees/search.json
  def search
    @employees = Employee.search(params[:search]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @employees.to_json }
      format.xml  { render :xml => @employees.to_xml }
    end
  end
  
  # GET|POST /employees/where.xml
  # GET|POST /employees/where.json
  def where
    @employees = Employee.where(params[:statement], *params[:params]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @employees.to_json }
      format.xml  { render :xml => @employees.to_xml }
    end
  end
  
  # GET /employees/in.xml
  # GET /employees/in.json
  def in
    @employees = Employee.in

    respond_to do |format|
      format.json  { render :json => @employees.to_json }
      format.xml  { render :xml => @employees.to_xml }
    end
  end
  
  # GET /employees/out.xml
  # GET /employees/out.json
  def out
    @employees = Employee.out

    respond_to do |format|
      format.json  { render :json => @employees.to_json }
      format.xml  { render :xml => @employees.to_xml }
    end
  end
  
  # GET|POST /employees/stamp.xml
  # GET|POST /employees/stamp.json
  def stamp
    @employee = Employee.find(params[:id])
    @employee.stamp

    respond_to do |format|
      format.json  { render :json => @employee.to_json, :status => :ok }
      format.xml  { render :xml => @employee.to_xml, :status => :ok }
    end
  end
  
  # POST /employees.xml
  # POST /employees.json
  def create
    @employee = Employee.create(params[:employee])

    respond_to do |format|
      if @employee.save
        format.json  { render :json => @employee.to_json, :status => :created }
        format.xml  { render :xml => @employee.to_xml, :status => :created }
      else
        format.json  { render :json => @employee.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @employee.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /employees/1.xml
  # PUT /employees/1.json
  def update
    @employee = Employee.find(params[:id])

    respond_to do |format|
      if @employee.update_attributes(params[:employee])
        format.json  { render :json => @employee.to_json, :status => :ok }
        format.xml  { render :xml => @employee.to_xml, :status => :ok }
      else
        format.json  { render :json => @employee.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @employee.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /employees/1.xml
  # DELETE /employees/1.json
  def destroy
    @employee = Employee.find(params[:id])
    @employee.destroy

    respond_to do |format|
      format.json  { render :json => @employee.to_json, :status => :ok }
      format.xml  { render :xml => @employee.to_xml, :status => :ok }
    end
  end
end