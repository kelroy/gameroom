class ApplicationController < ActionController::Base
  protect_from_forgery
  rescue_from ActiveRecord::RecordNotFound, :with => :handle_record_not_found
      
  private    
    def handle_record_not_found
      case request.format
      when Mime::JSON, Mime::XML
        head :not_found
      else
        render :text => "404 Not Found", :status => :not_found
      end
    end
end