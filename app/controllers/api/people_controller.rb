class Api::PeopleController < ApiController

  # GET /people.xml
  # GET /people.json
  def index
    @people = Person.all
    
    respond_to do |format|
      format.json { render :json => @people.to_json }
      format.xml  { render :xml => @people.to_xml }
    end
  end
  
  # GET /people/1.xml
  # GET /people/1.json
  def show
    @person = Person.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @person.to_json }
      format.xml  { render :xml => @person.to_xml }
    end
  end
  
  # GET|POST /people/search.xml
  # GET|POST /people/search.json
  def search
    @people = Person.search(params[:search]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @people.to_json }
      format.xml  { render :xml => @people.to_xml }
    end
  end
  
  # GET|POST /people/where.xml
  # GET|POST /people/where.json
  def where
    @people = Person.where(params[:statement], *params[:params]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @people.to_json }
      format.xml  { render :xml => @people.to_xml }
    end
  end
  
  # POST /people.xml
  # POST /people.json
  def create
    @person = Person.create(params[:person])

    respond_to do |format|
      if @person.save
        format.json  { render :json => @person.to_json, :status => :created }
        format.xml  { render :xml => @person.to_xml, :status => :created }
      else
        format.json  { render :json => @person.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @person.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /people/1.xml
  # PUT /people/1.json
  def update
    @person = Person.find(params[:id])

    respond_to do |format|
      if @person.update_attributes(params[:person])
        format.json  { render :json => @person.to_json, :status => :ok }
        format.xml  { render :xml => @person.to_xml, :status => :ok }
      else
        format.json  { render :json => @person.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @person.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /people/1.xml
  # DELETE /people/1.json
  def destroy
    @person = Person.find(params[:id])
    @person.destroy

    respond_to do |format|
      format.json  { render :json => @person.to_json, :status => :ok }
      format.xml  { render :xml => @person.to_xml, :status => :ok }
    end
  end
end
