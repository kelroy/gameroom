require 'spec_helper'

describe Item do
  before(:each) do
    Item.destroy_all
  end
  
  context "when given valid item data" do
    it "should be valid" do
      valid_data = {
        :title => 'Title',
        :sku => 0001
      }
      Item.new(valid_data).should be_valid
    end
  end
end
