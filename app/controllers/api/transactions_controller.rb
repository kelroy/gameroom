class Api::TransactionsController < ApiController

  # GET /transactions.xml
  # GET /transactions.json
  # GET /[parent]/:parent_id/transactions.xml
  # GET /[parent]/:parent_id/transactions.json
  def index
    if params[:transaction_id]
      @transactions = Transaction.find_all_by_transaction_id(params[:transaction_id])
    elsif params[:till_id]
      @transactions = Transaction.find_all_by_till_id(params[:till_id])
    else
      @transactions = Transaction.all
    end
    
    respond_to do |format|
      format.json { render :json => @transactions.to_json }
      format.xml  { render :xml => @transactions.to_xml }
    end
  end
  
  # GET /transactions/1.xml
  # GET /transactions/1.json
  def show
    @transaction = Transaction.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @transaction.to_json }
      format.xml  { render :xml => @transaction.to_xml }
    end
  end
  
  # GET|POST /transactions/search.xml
  # GET|POST /transactions/search.json
  def search
    @transactions = Transaction.search(params[:search]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @transactions.to_json }
      format.xml  { render :xml => @transactions.to_xml }
    end
  end
  
  # GET|POST /transactions/where.xml
  # GET|POST /transactions/where.json
  def where
    @transactions = Transaction.where(params[:statement], *params[:params]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @transactions.to_json }
      format.xml  { render :xml => @transactions.to_xml }
    end
  end
  
  # GET /transactions/1/receipt
  # GET /transactions/1/receipt.svg
  def receipt
    @transaction = Transaction.find(params[:id])
    
    respond_to do |format|
      format.html { render :layout => 'receipt' } # api/transactions/receipt.html.haml
      format.pdf                                  # api/transactions/receipt.pdf.prawn
    end
  end
  
  # POST /transactions.xml
  # POST /transactions.json
  def create
    @transaction = Transaction.create(params[:transaction])

    respond_to do |format|
      if @transaction.save
        format.json  { render :json => @transaction.to_json, :status => :created }
        format.xml  { render :xml => @transaction.to_xml, :status => :created }
      else
        format.json  { render :json => @transaction.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @transaction.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /transactions/1.xml
  # PUT /transactions/1.json
  def update
    @transaction = Transaction.find(params[:id])

    respond_to do |format|
      if @transaction.update_attributes(params[:transaction])
        format.json  { render :json => @transaction.to_json, :status => :ok }
        format.xml  { render :xml => @transaction.to_xml, :status => :ok }
      else
        format.json  { render :json => @transaction.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @transaction.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /transactions/1.xml
  # DELETE /transactions/1.json
  def destroy
    @transaction = Transaction.find(params[:id])
    @transaction.destroy

    respond_to do |format|
      format.json  { render :json => @transaction.to_json, :status => :ok }
      format.xml  { render :xml => @transaction.to_xml, :status => :ok }
    end
  end
end