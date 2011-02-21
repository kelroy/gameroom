require 'spec_helper'

describe Entry do
  before(:each) do
    Entry.destroy_all
  end
  
  context "when given valid entry data" do
    it "should be valid" do
      valid_data = {
        :transaction_id => 1,
        :title => 'Title',
        :price => 0,
        :quantity => 0
      }
      Entry.new(valid_data).should be_valid
    end
  end
end