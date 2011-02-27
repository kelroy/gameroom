class UserSessionsController < ApplicationController
  before_filter :authenticate, :only => :destroy
  layout 'session'
  
  def new
    @user_session = UserSession.new
  end
  
  def create
    @user_session = UserSession.new(params[:user_session])
    
    respond_to do |format|
      if @user_session.save
        format.html { redirect_to(root_url, :notice => 'Successfully logged in.') }
      else
        format.html { redirect_to login_url, :notice => 'Login or password incorrect.' }
      end
    end
  end
  
  def destroy
    @user_session = UserSession.find(params[:id])
    @user_session.destroy
    
    respond_to do |format|
      format.html { redirect_back_or_default login_url }
    end
  end
end