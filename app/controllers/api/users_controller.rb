class Api::UsersController < ApplicationController
  
  # GET /users
  # GET /users.json
  # GET /users.xml
  def index
    @users = User.all
    
    respond_to do |format|
      format.json { render :json => @users }
      format.xml  { render :xml => @users }
    end
  end
  
  # GET /users/1
  # GET /users/1.json
  # GET /users/1.xml
  def show
    @user = User.find(params[:id])
    
    respond_to do |format|
      format.json { render :json => @user }
      format.xml  { render :xml => @user }
    end
  end
  
  # POST /users
  # POST /users.xml
  # POST /users.json
  def create
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end

  # PUT /users/1
  # PUT /users/1.xml
  # PUT /users/1.json
  def update
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
  
  # DELETE /users/1
  # DELETE /users/1.json
  # DELETE /users/1.xml
  def destroy
    respond_to do |format|
      format.any { render :nothing => true, :status => :method_not_allowed }
    end
  end
end