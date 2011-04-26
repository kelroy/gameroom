class User < ActiveRecord::Base
  acts_as_authentic
  
  belongs_to  :person
  has_many    :transactions
  has_many    :timecards
  has_and_belongs_to_many :tills
  
  accepts_nested_attributes_for :person
  
  def self.find_by_login_or_email(login)
     find_by_login(login) || find_by_email(login)
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
end
