class Api::PaymentsController < ApplicationController
  
  # GET /payments
  # GET /payments.xml
  # GET /payments.json
  def index
    @payments = Payment.all
    
    respond_to do |format|
      format.json { render :json => @payments.to_json(:except => [:created_at, :updated_at]) }
      format.xml  { render :xml => @payments.to_xml(:except => [:created_at, :updated_at]) }
    end
  end
  
  # GET /payments/1
  # GET /payments/1.xml
  # GET /payments/1.json
  def show
    @payment = Payment.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @payment.to_json(:except => [:created_at, :updated_at]) }
      format.xml  { render :xml => @payment.to_xml(:except => [:created_at, :updated_at]) }
    end
  end
  
  # POST /payments
  # POST /payments.xml
  # POST /payments.json
  def create
    @payment = Payment.create(params[:payment])

    respond_to do |format|
      if @payment.save
        format.json  { render :json => @payment.to_json(:except => [:created_at, :updated_at]), :status => :created }
        format.xml  { render :xml => @payment.to_xml(:except => [:created_at, :updated_at]), :status => :created }
      else
        format.json  { render :json => @payment.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @payment.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /payments/1
  # PUT /payments/1.xml
  # PUT /payments/1.json
  def update
    @payment = Payment.find(params[:id])

    respond_to do |format|
      if @payment.update_attributes(params[:payment])
        format.json  { head :ok }
        format.xml  { head :ok }
      else
        format.json  { render :json => @payment.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @payment.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /payments/1
  # DELETE /payments/1.xml
  def destroy
    @payment = Payment.find(params[:id])
    @payment.destroy

    respond_to do |format|
      format.json  { head :ok }
      format.xml  { head :ok }
    end
  end
end