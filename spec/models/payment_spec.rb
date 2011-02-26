require 'spec_helper'

describe Payment do
  before(:each) do
    Payment.destroy_all
  end
  
  context "when given valid payment data" do
    it "should be valid" do
      valid_data = {
        :transaction_id => 1,
        :form => 'cash',
        :amount => 0
      }
      Payment.new(valid_data).should be_valid
    end
  end
end