require 'spec_helper'

describe Property do
  before(:each) do
    Property.destroy_all
  end
  
  context "when given valid property data" do
    it "should be valid" do
      valid_data = {
        :key => 'Foo',
        :value => 'Bar'
      }
      Property.new(valid_data).should be_valid
    end
  end
end
