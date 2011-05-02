class User < ActiveRecord::Base
  acts_as_authentic
  
  belongs_to  :person
  has_many    :transactions
  has_many    :timecards
  has_many    :entries
  
  accepts_nested_attributes_for :person
  
  def self.find_by_login_or_email(login)
     find_by_login(login) || find_by_email(login)
  end
  
  # Find users who are clocked in
  def self.in
    users = []
    all_users = self.all
    all_users.each do |user|
      if user.in?
        users.push(user)
      end
    end
    users
  end
  
  # Find users who are clocked out
  def self.out
    users = []
    all_users = self.all
    all_users.each do |user|
      if user.out?
        users.push(user)
      end
    end
    users
  end
  
  # Is user active?
  def active?
    self.active
  end
  
  # Is user admin?
  def admin?
    self.administrator
  end
  
  # Activate the user
  def activate!
    self.active = true
    save
  end
  
  # Begin or end a timecard for user
  def stamp
    active_timecards = self.timecards.where('end IS NULL')
    if active_timecards.length > 0
      active_timecards.each do |timecard|
        timecard.end = Time.now
        timecard.save
      end
    else
      Timecard.create(:user => self, :begin => Time.now)
    end
  end
  
  # Is user clocked in?
  def in?
    active_timecards = self.timecards.where('end IS NULL')
    if active_timecards.length > 0
      return true
    end
    return false
  end
  
  # Is user not clocked in?
  def out?
    active_timecards = self.timecards.where('end IS NULL')
    if active_timecards.length == 0
      return true
    end
    return false
  end
end
