require 'spec_helper'

describe Address do
  before(:each) do
    Address.destroy_all
  end
  
  context "when given valid address data" do
    it "should be valid" do
      valid_data = {
        :person_id => 1,
        :first_line => "555 Street Way",
        :city => "Lincoln",
        :state => "NE",
        :country => "US",
        :zip => "55555-5555"
      }
      Address.new(valid_data).should be_valid
    end
  end
end
