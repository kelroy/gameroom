require 'spec_helper'

describe Employee do
  before(:each) do
    Employee.destroy_all
  end
  
  context "when given valid employee data" do
    it "should be valid" do
      valid_data = {
        :rate => 0
      }
      Employee.new(valid_data).should be_valid
    end
  end
end