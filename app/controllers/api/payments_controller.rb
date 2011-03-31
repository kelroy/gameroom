class Api::PaymentsController < ApplicationController
  
  # GET /payments.xml
  # GET /payments.json
  # GET /transactions/:transaction_id/payments.xml
  # GET /transactions/:transaction_id/payments.json
  def index
    if params[:transaction_id]
      @payments = Payment.find_all_by_transaction_id(params[:transaction_id])
    else
      @payments = Payment.all
    end
    
    respond_to do |format|
      format.json { render :json => @payments.to_json }
      format.xml  { render :xml => @payments.to_xml }
    end
  end
  
  # GET /payments/1.xml
  # GET /payments/1.json
  def show
    @payment = Payment.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @payment.to_json }
      format.xml  { render :xml => @payment.to_xml }
    end
  end
  
  # POST /payments.xml
  # POST /payments.json
  def create
    @payment = Payment.create(params[:payment])

    respond_to do |format|
      if @payment.save
        format.json  { render :json => @payment.to_json, :status => :created }
        format.xml  { render :xml => @payment.to_xml, :status => :created }
      else
        format.json  { render :json => @payment.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @payment.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /payments/1.xml
  # PUT /payments/1.json
  def update
    @payment = Payment.find(params[:id])

    respond_to do |format|
      if @payment.update_attributes(params[:payment])
        format.json  { render :json => @payment.to_json, :status => :ok }
        format.xml  { render :xml => @payment.to_xml, :status => :ok }
      else
        format.json  { render :json => @payment.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @payment.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /payments/1.xml
  # DELETE /payments/1.json
  def destroy
    @payment = Payment.find(params[:id])
    @payment.destroy

    respond_to do |format|
      format.json  { head :ok }
      format.xml  { head :ok }
    end
  end
end