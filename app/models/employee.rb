class Employee < ActiveRecord::Base
  attr_accessor :password
  
  validates_confirmation_of :password
  validates_presence_of     :password, :on => :create
  validates_presence_of     :rate
  validates_inclusion_of    :manager, :in => [true, false]
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
    employee = find_by_token(token)
    if employee && employee.password_hash = BCrypt::Engine.hash_secret(password, employee.password_salt)
      employee
    else
      nil
    end
  end
  
  def self.in
    employees = []
    all_employees = self.all
    all_employees.each do |employee|
      if employee.in?
        employees.push(employee)
      end
    end
    employees
  end
  
  def self.out
    employees = []
    all_employees = self.all
    all_employees.each do |employee|
      if employee.out?
        employees.push(employee)
      end
    end
    employees
  end
  
  def stamp
    active_timecards = self.timecards.where('end IS NULL')
    if active_timecards.length > 0
      active_timecards.each do |timecard|
        timecard.end = Time.now
        timecard.save
      end
    else
      Timecard.create(:employee => self, :begin => Time.now)
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
  
  def manager?
    self.manager
  end
  
  def active?
    self.active
  end
  
  private
  
  def _default
    self.rate     ||= 0 if new_record?
    self.manager  ||= false if new_record?
    self.active   ||= true if new_record?
  end
  
  def _encrypt_password
    if self.password.present?
      self.password_salt = BCrypt::Engine.generate_salt
      self.password_hash = BCrypt::Engine.hash_secret(self.password, self.password_salt)
    end
  end
end