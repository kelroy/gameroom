require 'spec_helper'

describe Customer do
  before(:each) do
    Customer.destroy_all
  end
  
  context "when given valid customer data" do
    it "should be valid" do
      valid_data = {
        :credit => 0
      }
      Customer.new(valid_data).should be_valid
    end
  end
end
