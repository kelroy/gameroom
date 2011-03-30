require 'spec_helper'

describe Timecard do
  before(:each) do
    Timecard.destroy_all
  end
  
  context "when given valid timecard data" do
    it "should be valid" do
      valid_data = {
        :employee_id => 1,
        :begin => Time.now,
        :end => Time.now
      }
      Timecard.new(valid_data).should be_valid
    end
  end
end