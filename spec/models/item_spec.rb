require 'spec_helper'

describe Item do
  before(:each) do
    Item.destroy_all
  end
  
  context "when given valid item data" do
    it "should be valid" do
      valid_data = {
        :transaction_id => 1,
        :title => 'Title',
        :description => 'Lorem Ipsum...',
        :price => 0,
        :quantity => 0
      }
      Item.new(valid_data).should be_valid
    end
  end
end