require 'spec_helper'

describe Item do
  before(:each) do
    Item.destroy_all
  end
  
  context "when given valid item data" do
    it "should be valid" do
      valid_data = {
        :title => 'Title',
        :description => 'Lorem Ipsum...',
        :sku => 0001,
        :price => 0,
        :credit => 0,
        :cash => 0,
        :taxable => true,
        :discountable => true,
        :locked => true,
        :active => true
      }
      Item.new(valid_data).should be_valid
    end
  end
end
