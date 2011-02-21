class User < ActiveRecord::Base
  acts_as_authentic
  
  has_one     :person
  
  accepts_nested_attributes_for :person
  
  def self.find_by_login_or_email(login)
     find_by_login(login) || find_by_email(login)
  end
  
  # Is user active?
  def active?
    self.active
  end
  
  def activate!
    self.active = true
    save
  end

  def deliver_password_reset!
    reset_perishable_token!
    Notification.password_reset(self).deliver
  end

  def deliver_welcome!
    reset_perishable_token!
    Notification.welcome(self).deliver
  end
end
