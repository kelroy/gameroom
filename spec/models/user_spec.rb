require 'spec_helper'

describe User do
  before(:each) do
    User.destroy_all
    @user = Factory(:user)
  end
  
  context "when given valid user data" do
    it "should be valid" do
      valid_data = {
        :login => 'example',
        :email => 'example@example.com',
        :password => 'password',
        :password_confirmation => 'password'
      }
      User.new(valid_data).should be_valid
    end
  end
end
