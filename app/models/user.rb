class User < ActiveRecord::Base
  attr_accessor :password
  
  validates_confirmation_of :password
  validates_presence_of     :password, :on => :create
  validates_presence_of     :rate
  validates_inclusion_of    :administrator, :in => [true, false]
  validates_inclusion_of    :active, :in => [true, false]
  validates_uniqueness_of   :token
  validates_format_of       :token, :with => /\A[a-z0-9_]+\z/, 
                                    :message => "Token must contain only letters, numbers and underscores."
                                    
  after_initialize          :_default
  before_save               :_encrypt_password
  
  belongs_to  :account
  belongs_to  :person
  has_many    :transactions
  has_many    :timecards
  has_many    :shifts
  has_many    :entries
  
  def self.find_by_id_or_token(param)
    find_by_id(param) || find_by_token(param)
  end
  
  def self.authenticate(token, password)
    user = find_by_token(token)
    if user && user.password_hash = BCrypt::Engine.hash_secret(password, user.password_salt)
      user
    else
      nil
    end
  end
  
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
  
  def in?
    active_timecards = self.timecards.where('end IS NULL')
    if active_timecards.length > 0
      return true
    end
    return false
  end
  
  def out?
    active_timecards = self.timecards.where('end IS NULL')
    if active_timecards.length == 0
      return true
    end
    return false
  end
  
  def administrator?
    self.administrator
  end
  
  def active?
    self.active
  end
  
  private
  
  def _default
    self.rate     ||= 0 if new_record?
    self.administrator  ||= false if new_record?
    self.active   ||= true if new_record?
  end
  
  def _encrypt_password
    if self.password.present?
      self.password_salt = BCrypt::Engine.generate_salt
      self.password_hash = BCrypt::Engine.hash_secret(self.password, self.password_salt)
    end
  end
end