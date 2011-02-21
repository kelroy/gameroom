require 'spec_helper'

describe Good do
  before(:each) do
    Good.destroy_all
  end
  
  context "when given valid good data" do
    it "should be valid" do
      valid_data = {
        :title => 'Title',
        :sku => 0001
      }
      Good.new(valid_data).should be_valid
    end
  end
  
  it "should have a unique sku" do
    good = Factory.create(:good)
    Factory.build(:good, :sku => good.sku).should_not be_valid
  end
end
