require 'spec_helper'

describe Line do
  before(:each) do
    Line.destroy_all
  end
  
  context "when given valid line data" do
    it "should be valid" do
      valid_data = {
        :transaction_id => 1,
        :item_id => 1,
        :quantity => 0,
        :price => 0
      }
      Line.new(valid_data).should be_valid
    end
  end
end