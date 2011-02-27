class GoodsController < ApplicationController
  
  # GET /goods
  # GET /goods.xml
  # GET /goods.json
  def index
    @goods = Good.all
    
    respond_to do |format|
      format.json { render :json => @goods.to_json(:except => [:created_at, :updated_at, :account_id]) }
      format.xml  { render :xml => @goods.to_xml(:except => [:created_at, :updated_at, :account_id]) }
    end
  end
  
  # GET /goods/1
  # GET /goods/1.xml
  # GET /goods/1.json
  def show
    @good = Good.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @good.to_json(:except => [:created_at, :updated_at, :account_id]) }
      format.xml  { render :xml => @good.to_xml(:except => [:created_at, :updated_at, :account_id]) }
    end
  end
  
  # POST /goods
  # POST /goods.xml
  # POST /goods.json
  def create
    @good = Good.create(params[:good])

    respond_to do |format|
      if @good.save
        format.json  { render :json => @good.to_json(:except => [:created_at, :updated_at, :account_id]), :status => :created, :location => @good }
        format.xml  { render :xml => @good.to_xml(:except => [:created_at, :updated_at, :account_id]), :status => :created, :location => @good }
      else
        format.json  { render :json => @good.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @good.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /goods/1
  # PUT /goods/1.xml
  # PUT /goods/1.json
  def update
    @good = Good.find(params[:id])

    respond_to do |format|
      if @good.update_attributes(params[:good])
        format.json  { head :ok }
        format.xml  { head :ok }
      else
        format.json  { render :json => @good.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @good.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /goods/1
  # DELETE /goods/1.json
  # DELETE /goods/1.xml
  def destroy
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
end