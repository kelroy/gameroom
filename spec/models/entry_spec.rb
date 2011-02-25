require 'spec_helper'

describe Entry do
  before(:each) do
    Entry.destroy_all
  end
  
  context "when given valid entry data" do
    it "should be valid" do
      valid_data = {
        :till_id => 1,
        :title => 'Title',
        :description => 'Lorem Ipsum...',
        :time => Time.now,
        :amount => 0,
        :action => 'debit'
      }
      Entry.new(valid_data).should be_valid
    end
  end
  
  it "should accept only valid actions" do
    entry = Factory.build(:entry)
    entry.action = 'bad'
    entry.should_not be_valid
    entry.action = 'debit'
    entry.should be_valid
  end
end