class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :authorize
  helper_method :current_user_session, :current_user
  rescue_from ActiveRecord::RecordNotFound, :with => :handle_record_not_found
      
  private
    def authorize
      case request.format
      when Mime::JSON, Mime::XML
        authenticate_or_request_with_http_basic do |api_key, api_secret|
          return api_key == 'x' && api_secret == 'x'
        end
      end
    end
    
    def handle_record_not_found
      case request.format
      when Mime::JSON, Mime::XML
        head :not_found
      else
        render :text => "404 Not Found", :status => :not_found
      end
    end
    
    def current_user_session
      return @current_user_session if defined?(@current_user_session)
      @current_user_session = UserSession.find
    end

    def current_user
      return @current_user if defined?(@current_user)
      @current_user = current_user_session && current_user_session.user
    end
  
    def authenticate
      unless current_user
        store_location
        redirect_to login_path
        return false
      end
    end
    
    def super_authenticate
      unless current_user && current_user.admin?
        store_location
        redirect_to login_path
        return false
      end
    end
    
    def redirect_back_or_default(default)
      redirect_to(session[:return_to] || default)
      session[:return_to] = nil
    end
    
    def store_location
      session[:return_to] = request.fullpath
    end
end