module Rack
  class JSONValidate
    CONTENT_TYPES = ['application/json']
    
    def initialize(app)
      @app = app
    end
    
    def valid?(content)
      unless content.empty?
        JSON.parse(content) rescue return false
      else
        true
      end
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