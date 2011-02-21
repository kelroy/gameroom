require 'spec_helper'

describe Email do
  before(:each) do
    Email.destroy_all
    @email = Factory(:email)
  end
  
  context "when given valid email data" do
    it "should be valid" do
      valid_data = {
        :person_id => 1,
        :address => "example@example.com"
      }
      Email.new(valid_data).should be_valid
    end
  end
  
  it "should only allow valid email addresses" do
    @email.address = ''
    @email.should_not be_valid
    @email.address = 'example@example.com'
    @email.should be_valid
  end
end
