class User < ActiveRecord::Base
  acts_as_authentic
  
  has_one     :person
  has_and_belongs_to_many :tills
  
  accepts_nested_attributes_for :person
  
  def self.find_by_login_or_email(login)
     find_by_login(login) || find_by_email(login)
  end
  
  # Is user active?
  def active?
    self.active
  end
  
  # Activate the user
  def activate!
    self.active = true
    save
  end
end
