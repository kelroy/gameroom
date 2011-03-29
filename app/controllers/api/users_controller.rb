class Api::UsersController < ApplicationController
  
  # GET /users.json
  # GET /users.xml
  def index
    @users = User.all
    
    respond_to do |format|
      format.json { render :json => @users.to_json(:except => [:password_hash, :password_salt, :perishable_token, :persistence_token]) }
      format.xml  { render :xml => @users.to_xml(:except => [:password_hash, :password_salt, :perishable_token, :persistence_token]) }
    end
  end
  
  # GET /users/1.json
  # GET /users/1.xml
  def show
    @user = User.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @user.to_json(:except => [:password_hash, :password_salt, :perishable_token, :persistence_token]) }
      format.xml  { render :xml => @user.to_xml(:except => [:password_hash, :password_salt, :perishable_token, :persistence_token]) }
    end
  end
  
  # POST /users.xml
  # POST /users.json
  def create
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end

  # PUT /users/1.xml
  # PUT /users/1.json
  def update
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
  
  # DELETE /users/1.json
  # DELETE /users/1.xml
  def destroy
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
end