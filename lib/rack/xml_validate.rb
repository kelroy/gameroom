require 'rexml/document'

module Rack
  class XMLValidate
    CONTENT_TYPES = ['text/xml', 'application/xml']
    
    def initialize(app)
      @app = app
    end
    
    def valid?(input)
      REXML::Document.new(input) rescue return false
    end
    
    def call(env)
      begin
        if CONTENT_TYPES.include?(env['CONTENT_TYPE'])
          unless valid?(env["rack.input"].read)
            return [400, {"Content-Type" => env['CONTENT_TYPE']}, []]
          end
        end
      rescue
      ensure
        env["rack.input"].rewind
      end
      
      @app.call(env)
    end
  end
end