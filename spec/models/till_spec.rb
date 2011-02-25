require 'spec_helper'

describe Till do
  before(:each) do
    Till.destroy_all
  end
  
  context "when given valid till data" do
    it "should be valid" do
      valid_data = {
        :title => 'Title',
        :description => 'Lorem Ipsum...',
        :minimum_transfer => 0,
        :minimum_balance => 0,
        :retainable => true,
        :active => true
      }
      Till.new(valid_data).should be_valid
    end
  end
end
