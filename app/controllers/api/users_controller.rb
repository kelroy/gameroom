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
  # GET /people/:person_id/users.xml
  # GET /people/:person_id/users.json
  def show
    if params[:person_id]
      @user = User.find_by_person_id(params[:person_id])
    else
      @user = User.find(params[:id])
    end
    
    respond_to do |format|
      format.json { render :json => @user.to_json(:except => [:password_hash, :password_salt, :perishable_token, :persistence_token]) }
      format.xml  { render :xml => @user.to_xml(:except => [:password_hash, :password_salt, :perishable_token, :persistence_token]) }
    end
  end
  
  # GET|POST /users/search.xml
  # GET|POST /users/search.json
  def search
    @users = User.search(params[:search]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @users.to_json }
      format.xml  { render :xml => @users.to_xml }
    end
  end
  
  # GET|POST /users/where.xml
  # GET|POST /users/where.json
  def where
    @users = User.where(params[:statement], *params[:params]).paginate(:page => params[:page], :per_page => params[:per_page])
    
    respond_to do |format|
      format.json { render :json => @users.to_json }
      format.xml  { render :xml => @users.to_xml }
    end
  end
  
  # GET /users/in.xml
  # GET /users/in.json
  def in
    @users = User.in

    respond_to do |format|
      format.json  { render :json => @users.to_json }
      format.xml  { render :xml => @users.to_xml }
    end
  end
  
  # GET /users/out.xml
  # GET /users/out.json
  def out
    @users = User.out

    respond_to do |format|
      format.json  { render :json => @users.to_json }
      format.xml  { render :xml => @users.to_xml }
    end
  end
  
  # GET|POST /users/stamp.xml
  # GET|POST /users/stamp.json
  def stamp
    @user = User.find(params[:id])
    @user.stamp

    respond_to do |format|
      format.json  { render :json => @user.to_json, :status => :ok }
      format.xml  { render :xml => @user.to_xml, :status => :ok }
    end
  end
  
  # POST /users.xml
  # POST /users.json
  def create
    @user = User.create(params[:user])

    respond_to do |format|
      if @user.save
        format.json  { render :json => @user.to_json, :status => :created }
        format.xml  { render :xml => @user.to_xml, :status => :created }
      else
        format.json  { render :json => @user.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @user.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /users/1.xml
  # PUT /users/1.json
  def update
    @user = User.find(params[:id])

    respond_to do |format|
      if @user.update_attributes(params[:user])
        format.json  { render :json => @user.to_json, :status => :ok }
        format.xml  { render :xml => @user.to_xml, :status => :ok }
      else
        format.json  { render :json => @user.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @user.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1.xml
  # DELETE /users/1.json
  def destroy
    @user = User.find(params[:id])
    @user.destroy

    respond_to do |format|
      format.json  { render :json => @user.to_json, :status => :ok }
      format.xml  { render :xml => @user.to_xml, :status => :ok }
    end
  end
end