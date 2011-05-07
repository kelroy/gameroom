class ApiController < ApplicationController
  before_filter :authorize
      
  private
    def authorize
      case request.format
      when Mime::JSON, Mime::XML
        authenticate_or_request_with_http_basic do |api_key, api_secret|
          return api_key == 'x' && api_secret == 'x'
        end
      end
    end
end