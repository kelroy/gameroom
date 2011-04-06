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
        :title => "Title",
        :description => "Lorem Ipsum...",
        :quantity => 0,
        :condition => 1,
        :discount => 1,
        :price => 0,
        :credit => 0,
        :cash => 0,
        :purchase => true,
        :taxable => true,
        :discountable => true
      }
      Line.new(valid_data).should be_valid
    end
  end
end