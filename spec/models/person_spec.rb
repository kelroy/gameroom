require 'spec_helper'

describe Person do
  before(:each) do
    Person.destroy_all
  end
  
  context "when given valid person data" do
    it "should be valid" do
      valid_data = {
        :first_name => 'First',
        :middle_name => 'Middle',
        :last_name => 'Last'
      }
      Person.new(valid_data).should be_valid
    end
  end
end
