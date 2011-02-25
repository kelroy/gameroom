require 'spec_helper'

describe Transaction do
  before(:each) do
    Transaction.destroy_all
  end
  
  context "when given valid transaction data" do
    it "should be valid" do
      valid_data = {
        :customer_id => 1,
        :tax_rate => 0.06,
        :complete => true,
        :locked => false
      }
      Transaction.new(valid_data).should be_valid
    end
  end
end
