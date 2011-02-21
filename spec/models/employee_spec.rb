require 'spec_helper'

describe Employee do
  before(:each) do
    Employee.destroy_all
  end
  
  context "when given valid employee data" do
    it "should be valid" do
      valid_data = {
        :pin => 1000
      }
      Employee.new(valid_data).should be_valid
    end
  end
  
  it "should have a 4 digit pin" do
    Factory.build(:employee, :pin => 0).should_not be_valid
    Factory.build(:employee, :pin => 1000).should be_valid
    Factory.build(:employee, :pin => 9999).should be_valid
    Factory.build(:employee, :pin => 10000).should_not be_valid
  end
end