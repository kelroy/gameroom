require 'spec_helper'

describe Phone do
  before(:each) do
    Phone.destroy_all
  end
  
  context "when given valid phone data" do
    it "should be valid" do
      valid_data = {
        :person_id => 1,
        :number => "555-555-5555"
      }
      Phone.new(valid_data).should be_valid
    end
  end
end
