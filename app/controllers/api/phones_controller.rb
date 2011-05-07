class Api::PhonesController < ApiController
  
  # GET /phones.xml
  # GET /phones.json
  # GET /people/:person_id/emails.xml
  # GET /people/:person_id/emails.json
  def index
    if params[:person_id]
      @phones = Phone.find_all_by_person_id(params[:person_id])
    else
      @phones = Phone.all
    end
    
    respond_to do |format|
      format.json { render :json => @phones.to_json }
      format.xml  { render :xml => @phones.to_xml }
    end
  end
  
  # GET /phones/1.xml
  # GET /phones/1.json
  def show
    @phone = Phone.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @phone.to_json }
      format.xml  { render :xml => @phone.to_xml }
    end
  end
  
  # GET|POST /phones/search.xml
  # GET|POST /phones/search.json
  def search
    @phones = Phone.search(params[:search]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @phones.to_json }
      format.xml  { render :xml => @phones.to_xml }
    end
  end
  
  # GET|POST /phones/where.xml
  # GET|POST /phones/where.json
  def where
    @phones = Phone.where(params[:statement], *params[:params]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @phones.to_json }
      format.xml  { render :xml => @phones.to_xml }
    end
  end
  
  # POST /phones.xml
  # POST /phones.json
  def create
    @phone = Phone.create(params[:phone])

    respond_to do |format|
      if @phone.save
        format.json  { render :json => @phone.to_json, :status => :created }
        format.xml  { render :xml => @phone.to_xml, :status => :created }
      else
        format.json  { render :json => @phone.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @phone.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /phones/1.xml
  # PUT /phones/1.json
  def update
    @phone = Phone.find(params[:id])

    respond_to do |format|
      if @phone.update_attributes(params[:phone])
        format.json  { render :json => @phone.to_json, :status => :ok }
        format.xml  { render :xml => @phone.to_xml, :status => :ok }
      else
        format.json  { render :json => @phone.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @phone.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /phones/1.xml
  # DELETE /phones/1.json
  def destroy
    @phone = Phone.find(params[:id])
    @phone.destroy

    respond_to do |format|
      format.json  { render :json => @phone.to_json, :status => :ok }
      format.xml  { render :xml => @phone.to_xml, :status => :ok }
    end
  end
end